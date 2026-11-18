#!/usr/bin/env python3
"""Lồng tiếng tiếng Việt bằng ElevenLabs cho pipeline video (PIPELINE-VIDEO.md, Bước 7).

Chỉ dùng thư viện chuẩn của Python, không cần cài thêm gói.

Cấu hình đọc từ biến môi trường hoặc file `.env` ở gốc workspace (đã có trong .gitignore):
    ELEVENLABS_API_KEY   bắt buộc, KHÔNG commit, KHÔNG dán vào chat
    ELEVENLABS_VOICE_ID  mặc định ObhtJZSfI8Ps4i8lwyVx
    ELEVENLABS_MODEL_ID  mặc định eleven_v4 (xác minh bằng --list-models)
    ELEVENLABS_LANGUAGE  mặc định vi

Cách dùng:
    py -3 scripts/video/elevenlabs_tts.py --check
    py -3 scripts/video/elevenlabs_tts.py --list-models
    py -3 scripts/video/elevenlabs_tts.py work/<chu-de>/video/voiceover.json
    py -3 scripts/video/elevenlabs_tts.py work/<chu-de>/video/voiceover.json --only S03 --force

Định dạng voiceover.json:
    {"shots": [{"id": "S01", "start": "0:00", "end": "0:12", "text": "Lời đọc..."}]}
Đầu ra: <thư mục json>/voiceover/<id>.mp3, voiceover.srt và manifest.json.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.elevenlabs.io"
ROOT = Path(__file__).resolve().parents[2]
DEFAULTS = {
    "ELEVENLABS_VOICE_ID": "ObhtJZSfI8Ps4i8lwyVx",
    "ELEVENLABS_MODEL_ID": "eleven_v4",
    "ELEVENLABS_LANGUAGE": "vi",
    "ELEVENLABS_OUTPUT_FORMAT": "mp3_44100_128",
}


def load_env() -> dict[str, str]:
    env = dict(DEFAULTS)
    env_file = ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    for k in list(env) + ["ELEVENLABS_API_KEY"]:
        if os.environ.get(k):
            env[k] = os.environ[k]
    if not env.get("ELEVENLABS_API_KEY"):
        sys.exit("Thiếu ELEVENLABS_API_KEY. Tạo file .env ở gốc workspace theo mẫu .env.example.")
    return env


def request(env: dict, method: str, path: str, body: dict | None = None) -> bytes:
    req = urllib.request.Request(
        API + path,
        method=method,
        data=json.dumps(body).encode("utf-8") if body is not None else None,
        headers={"xi-api-key": env["ELEVENLABS_API_KEY"], "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:500]
        raise RuntimeError(f"HTTP {e.code} {path}: {detail}") from None


def check(env: dict) -> None:
    try:
        user = json.loads(request(env, "GET", "/v1/user/subscription"))
        print(f"Kết nối OK. Gói: {user.get('tier')}; ký tự đã dùng {user.get('character_count')}/{user.get('character_limit')}")
    except RuntimeError as e:
        if "invalid_api_key" in str(e) or "api_key_id_used" in str(e):
            raise
        print("Không đọc được thông tin gói (key có thể không có quyền User → Read). Tiếp tục kiểm tra.")
    voice = json.loads(request(env, "GET", f"/v1/voices/{env['ELEVENLABS_VOICE_ID']}"))
    print(f"Giọng: {voice.get('name')} ({env['ELEVENLABS_VOICE_ID']})")
    ids = [m.get("model_id") for m in json.loads(request(env, "GET", "/v1/models"))]
    ok = env["ELEVENLABS_MODEL_ID"] in ids
    print(f"Model {env['ELEVENLABS_MODEL_ID']}: {'có' if ok else 'KHÔNG tìm thấy'} trong tài khoản")
    if not ok:
        print("Các model khả dụng:", ", ".join(ids))


def list_models(env: dict) -> None:
    for m in json.loads(request(env, "GET", "/v1/models")):
        langs = ",".join(l.get("language_id", "") for l in m.get("languages", []))
        print(f"{m.get('model_id'):32} {m.get('name')}  [{langs}]")


def to_seconds(t: str) -> float:
    parts = [float(p) for p in str(t).split(":")]
    s = 0.0
    for p in parts:
        s = s * 60 + p
    return s


def srt_time(sec: float) -> str:
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def synth(env: dict, text: str) -> bytes:
    body = {"text": text, "model_id": env["ELEVENLABS_MODEL_ID"], "language_code": env["ELEVENLABS_LANGUAGE"]}
    path = f"/v1/text-to-speech/{env['ELEVENLABS_VOICE_ID']}?output_format={env['ELEVENLABS_OUTPUT_FORMAT']}"
    try:
        return request(env, "POST", path, body)
    except RuntimeError as e:
        if "language_code" in str(e):  # model không nhận language_code → thử lại không có
            body.pop("language_code")
            return request(env, "POST", path, body)
        raise


def run(env: dict, src: Path, only: set[str], force: bool) -> None:
    shots = json.loads(src.read_text(encoding="utf-8"))["shots"]
    out = src.parent / "voiceover"
    out.mkdir(parents=True, exist_ok=True)
    manifest, srt, chars = [], [], 0
    for i, shot in enumerate(shots, 1):
        sid, text = shot["id"], (shot.get("text") or "").strip()
        if not text:
            continue
        mp3 = out / f"{sid}.mp3"
        if (not only or sid in only) and (force or not mp3.exists()):
            print(f"[{sid}] {len(text)} ký tự…", flush=True)
            mp3.write_bytes(synth(env, text))
            chars += len(text)
            time.sleep(0.5)
        manifest.append({"id": sid, "file": mp3.name, "start": shot.get("start"), "end": shot.get("end"), "text": text})
        if shot.get("start") is not None and shot.get("end") is not None:
            srt.append(f"{len(srt) + 1}\n{srt_time(to_seconds(shot['start']))} --> {srt_time(to_seconds(shot['end']))}\n{text}\n")
    (out / "manifest.json").write_text(json.dumps({
        "voice_id": env["ELEVENLABS_VOICE_ID"], "model_id": env["ELEVENLABS_MODEL_ID"], "shots": manifest,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    if srt:
        (out / "voiceover.srt").write_text("\n".join(srt), encoding="utf-8")
    print(f"Xong. Đã gửi {chars} ký tự. Đầu ra: {out}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("voiceover_json", nargs="?", type=Path)
    ap.add_argument("--check", action="store_true", help="kiểm tra key, giọng và model")
    ap.add_argument("--list-models", action="store_true")
    ap.add_argument("--only", default="", help="chỉ tạo các shot này, ví dụ S01,S03")
    ap.add_argument("--force", action="store_true", help="tạo lại cả file đã có")
    a = ap.parse_args()
    env = load_env()
    if a.check:
        check(env)
    elif a.list_models:
        list_models(env)
    elif a.voiceover_json:
        run(env, a.voiceover_json, {s.strip() for s in a.only.split(",") if s.strip()}, a.force)
    else:
        ap.print_help()


if __name__ == "__main__":
    main()
