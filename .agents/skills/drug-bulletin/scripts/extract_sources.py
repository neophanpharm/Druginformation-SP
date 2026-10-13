"""Extract sources only; clinical interpretation is performed by the agent."""
import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

SUPPORTED = {'.pdf', '.docx', '.md', '.txt'}
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def read_text(path):
    raw = path.read_bytes()
    if raw.startswith((b'\xff\xfe', b'\xfe\xff')):
        return raw.decode('utf-16')
    return raw.decode('utf-8-sig')  # No silent replacement of corrupt characters.


def paragraph_text(node):
    parts = []
    for element in node.iter():
        if element.tag == W + 't':
            parts.append(element.text or '')
        elif element.tag == W + 'tab':
            parts.append('\t')
        elif element.tag in (W + 'br', W + 'cr'):
            parts.append('\n')
    return ''.join(parts)


def iter_docx_blocks(element):
    """Yield paragraphs and tables, recursively traversing structured document tags (sdt)."""
    for child in element:
        if child.tag == W + 'p':
            yield child
        elif child.tag == W + 'tbl':
            yield child
        elif child.tag == W + 'sdt':
            content = child.find(W + 'sdtContent')
            if content is not None:
                yield from iter_docx_blocks(content)


def extract(path):
    ext = path.suffix.lower()
    warnings = []
    if ext in {'.md', '.txt'}:
        value = read_text(path)
        text = '\n'.join(f'[L{i}] {line}' for i, line in enumerate(value.splitlines(), 1))
        if not value.strip():
            warnings.append('Empty source')
        return text, warnings, 'line-numbered text'
    if ext == '.docx':
        with zipfile.ZipFile(path) as archive:
            document = ET.fromstring(archive.read('word/document.xml'))
            body = document.find(W + 'body')
            if body is None:
                raise ValueError('DOCX has no document body')
            chunks, p, t = [], 0, 0
            for child in iter_docx_blocks(body):
                if child.tag == W + 'p':
                    p += 1
                    chunks.append(f'[P{p}] {paragraph_text(child)}')
                elif child.tag == W + 'tbl':
                    t += 1
                    chunks.append(f'[T{t}]')
                    for r, row in enumerate(child.findall(W + 'tr'), 1):
                        cells = []
                        for cell in row.findall(W + 'tc'):
                            cells.append(' / '.join(paragraph_text(x) for x in cell.findall(W + 'p')))
                        chunks.append(f'[T{t}:R{r}] ' + json.dumps(cells, ensure_ascii=False))
            if not any(paragraph_text(x).strip() for x in body):
                warnings.append('Empty document body')
            if document.findall('.//' + W + 'ins') or document.findall('.//' + W + 'del'):
                warnings.append('Tracked changes detected; inspect original document')
            if document.findall('.//' + W + 'txbxContent'):
                warnings.append('Text boxes detected; inspect original layout')
        return '\n\n'.join(chunks), warnings, 'DOCX body paragraphs and table cells; other parts not extracted'
    try:
        import pymupdf
    except ImportError:
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise RuntimeError('PDF requires pymupdf or pypdf') from exc
        reader = PdfReader(str(path))
        pages = [page.extract_text() or '' for page in reader.pages]
        method = 'pypdf'
    else:
        with pymupdf.open(str(path)) as document:
            pages = [page.get_text(sort=True) for page in document]
        method = 'pymupdf sorted page text'
    for i, page in enumerate(pages, 1):
        if len(page.strip()) < 40:
            warnings.append(f'Page {i}: little/no text; inspect original, OCR may be needed')
    if not pages:
        warnings.append('PDF has no pages')
    return '\n\n'.join(f'[PAGE {i}]\n{page}' for i, page in enumerate(pages, 1)), warnings, method


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', default='Input')
    parser.add_argument('--work', required=True)
    parser.add_argument('--files', nargs='+')
    args = parser.parse_args()
    source_root = Path(args.input).resolve()
    if not source_root.is_dir():
        parser.error('Input directory does not exist')
    sources = sorted(set(Path(p).resolve() for p in args.files)) if args.files else sorted(p.resolve() for p in source_root.rglob('*') if p.is_file())
    if not sources:
        print('No files found in input directory.')
        return 2
    work = Path(args.work).resolve()
    if work == source_root or source_root in work.parents:
        parser.error('Work directory must be outside Input')
    for source in sources:
        if source_root not in source.parents or not source.is_file():
            parser.error(f'Source must be an existing file inside Input: {source}')
    dest = work / 'extracted'
    dest.mkdir(parents=True, exist_ok=True)
    # Do not overwrite a previous run or change previously assigned source IDs.
    if (work / 'manifest.json').exists() or any(dest.iterdir()):
        parser.error('Extraction already exists; use a new work directory or review the prior run')
    records, skipped, failed = [], [], False
    for source in sources:
        if source.suffix.lower() not in SUPPORTED:
            skipped.append(str(source))
            continue
        sid = f'S{len(records) + 1:02d}'
        record = {'id': sid, 'source': str(source), 'sha256': hashlib.sha256(source.read_bytes()).hexdigest()}
        try:
            content, warnings, method = extract(source)
            slug = re.sub(r'[^\w.-]+', '-', source.stem).strip('-') or 'source'
            out = dest / f'{sid}-{slug}.md'
            out.write_text(f'# {sid}: {source.name}\n\n{content}\n', encoding='utf-8')
            record.update(extracted=str(out), method=method, warnings=warnings, status='needs_review' if warnings else 'extracted')
            failed = failed or bool(warnings)
        except Exception as exc:
            record.update(status='error', error=f'{type(exc).__name__}: {exc}')
            failed = True
        records.append(record)
    manifest = {'sources': records, 'unsupported': skipped, 'note': 'Extracted text is not verified evidence. Inspect original tables/figures and numerical claims.'}
    (work / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{len(records)} source(s); {len(skipped)} unsupported. Manifest: {work / "manifest.json"}')
    return 2 if failed or not records or skipped else 0


if __name__ == '__main__':
    sys.exit(main())
