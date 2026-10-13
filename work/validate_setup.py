import importlib.util
import json
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path
import pymupdf

root = Path.cwd()
script = root / '.agents/skills/drug-bulletin/scripts/extract_sources.py'
with tempfile.TemporaryDirectory(prefix='validation-', dir=root / 'work') as temporary:
    base = Path(temporary)
    inputs = base / 'Input'
    inputs.mkdir()
    (inputs / 'sample.md').write_text('Thuốc thử\nN = 100', encoding='utf-8')
    (inputs / 'sample.txt').write_text('Kết quả: 10/100', encoding='utf-16')
    xml = '''<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Test paragraph</w:t></w:r></w:p><w:sdt><w:sdtContent><w:p><w:r><w:t>SDT content paragraph</w:t></w:r></w:p></w:sdtContent></w:sdt><w:tbl><w:tr><w:tc><w:p><w:r><w:t>10/100</w:t></w:r></w:p></w:tc></w:tr></w:tbl></w:body></w:document>'''
    with zipfile.ZipFile(inputs / 'sample.docx', 'w') as archive:
        archive.writestr('word/document.xml', xml)
    with pymupdf.open() as doc:
        page = doc.new_page()
        page.insert_text((72, 72), 'Synthetic study: sample size 100; events 10/100; follow up 12 months.')
        doc.save(inputs / 'sample.pdf')
    def run(folder):
        return subprocess.run([sys.executable, str(script), '--input', str(inputs), '--work', str(folder)], capture_output=True, text=True, encoding='utf-8', errors='replace')
    result = run(base / 'normal')
    assert result.returncode == 0, result.stderr + result.stdout
    manifest = json.loads((base / 'normal/manifest.json').read_text(encoding='utf-8'))
    assert len(manifest['sources']) == 4
    contents = {Path(r['source']).suffix: Path(r['extracted']).read_text(encoding='utf-8') for r in manifest['sources']}
    assert '[PAGE 1]' in contents['.pdf'] and '10/100' in contents['.pdf']
    assert '[T1:R1]' in contents['.docx'] and '[P1]' in contents['.docx'] and 'SDT content paragraph' in contents['.docx']
    assert 'Thuốc thử' in contents['.md'] and '[L2]' in contents['.md']
    assert 'Kết quả' in contents['.txt']
    assert run(base / 'normal').returncode != 0, 'Existing extraction must not be overwritten'
    with pymupdf.open() as doc:
        doc.new_page()
        doc.save(inputs / 'blank.pdf')
    result = run(base / 'blank-run')
    assert result.returncode == 2
    manifest = json.loads((base / 'blank-run/manifest.json').read_text(encoding='utf-8'))
    blank = next(r for r in manifest['sources'] if Path(r['source']).name == 'blank.pdf')
    assert blank['status'] == 'needs_review' and blank['warnings']
    (inputs / 'broken.docx').write_bytes(b'not a zip')
    result = run(base / 'broken-run')
    assert result.returncode == 2
    manifest = json.loads((base / 'broken-run/manifest.json').read_text(encoding='utf-8'))
    assert any(r['status'] == 'error' for r in manifest['sources'])
print('PASS: PDF, DOCX table/paragraphs, MD, UTF-16 TXT, scan warning, corrupt source, overwrite protection.')
(root / 'work/setup-validation.md').write_text('# Kiểm tra thiết lập\n\n- Skill validator: đạt.\n- Trích xuất PDF, DOCX (đoạn, bảng, khối SDT), MD, TXT UTF-16: đạt.\n- Tương thích console Windows UTF-8 (không lỗi charmap Unicode): đạt.\n- Cảnh báo PDF trắng/ít văn bản, lỗi nguồn hỏng, bảo vệ không ghi đè: đạt.\n- Dữ liệu thử đã được dọn tự động.\n- Chưa kiểm chứng một bản tin thực tế vì Input chưa có tài liệu.\n', encoding='utf-8')
