#!/usr/bin/env python3
"""Generate a simple CV placeholder PDF and OG image for the portfolio."""
import os
from pathlib import Path

PUBLIC = Path("/home/z/my-project/public")
PUBLIC.mkdir(parents=True, exist_ok=True)

# ----- 1. CV placeholder (minimal valid PDF) -----
cv_path = PUBLIC / "cv-mahop-olivier-constantin.pdf"
cv_content = """%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 220 >>
stream
BT
/F1 18 Tf
72 720 Td
(MAHOP Olivier Constantin) Tj
0 -28 Td
/F1 11 Tf
(Data Scientist & Data Engineer en formation) Tj
0 -20 Td
(Douala, Cameroun - Disponible en remote) Tj
0 -20 Td
(Mahopolivierconstantin39@gmail.com) Tj
0 -32 Td
/F1 13 Tf
(Ce fichier est un placeholder. Remplacez-le par votre vrai CV PDF.) Tj
0 -16 Td
/F1 11 Tf
(Placez votre CV nomme cv-mahop-olivier-constantin.pdf dans /public) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000241 00000 n 
0000000515 00000 n 
trailer
<< /Root 1 0 R /Size 6 >>
startxref
582
%%EOF
"""
cv_path.write_text(cv_content, encoding="latin-1")
print(f"Created: {cv_path}")

# ----- 2. SVG favicon -----
favicon = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <text x="32" y="42" font-family="monospace" font-size="32" font-weight="bold"
        text-anchor="middle" fill="#10b981">O</text>
</svg>
"""
(PUBLIC / "favicon.svg").write_text(favicon)
print(f"Created: {PUBLIC / 'favicon.svg'}")
