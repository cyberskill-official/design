"""Test-only text extraction from actual PDF bytes; dependency is hash-pinned."""
import json
import sys
try:
    import pypdf
except ImportError as error:
    raise SystemExit("Install hash-pinned _audit/ci/requirements-pdf.txt in an isolated venv and set CS_PDF_PYTHON") from error

if pypdf.__version__ != "6.21.1":
    raise RuntimeError("Install the hash-pinned _audit/ci/requirements-pdf.txt in an isolated environment")
if len(sys.argv) != 2:
    raise SystemExit("Usage: pdf-text.py PDF_FILE")
with open(sys.argv[1], "rb") as stream:
    reader = pypdf.PdfReader(stream, strict=True)
    print(json.dumps({"parser": "pypdf", "version": pypdf.__version__, "pages": len(reader.pages), "text": "\n".join(page.extract_text() or "" for page in reader.pages)}))
