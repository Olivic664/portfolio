#!/usr/bin/env python3
"""Generate OG image (1200x630) for the portfolio."""
import matplotlib.font_manager as fm
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')

import matplotlib.pyplot as plt
import matplotlib.patches as patches

plt.rcParams['font.sans-serif'] = ['DejaVu Sans']

fig, ax = plt.subplots(figsize=(12, 6.3), dpi=100)
fig.patch.set_facecolor('#0a0a0a')
ax.set_facecolor('#0a0a0a')
ax.set_xlim(0, 12)
ax.set_ylim(0, 6.3)
ax.axis('off')

# Subtle grid
for i in range(0, 13, 1):
    ax.axvline(i, color='#1a1a1a', linewidth=0.5, alpha=0.5, zorder=0)
for i in range(0, 7, 1):
    ax.axhline(i, color='#1a1a1a', linewidth=0.5, alpha=0.5, zorder=0)

# Accent dot
circle = patches.Circle((0.6, 5.7), 0.08, facecolor='#10b981', zorder=2)
ax.add_patch(circle)

# Top mono tag
ax.text(0.85, 5.7, '$ whoami',
        fontsize=14, color='#10b981', fontfamily='monospace',
        verticalalignment='center', zorder=3)

# Name
ax.text(0.6, 4.4, 'MAHOP',
        fontsize=68, color='#ffffff', fontweight='bold',
        verticalalignment='center', zorder=3)
ax.text(0.6, 3.3, 'Olivier Constantin',
        fontsize=68, color='#10b981', fontweight='bold',
        verticalalignment='center', zorder=3)

# Title
ax.text(0.62, 2.3, 'Data Scientist  &  Data Engineer',
        fontsize=22, color='#a3a3a3', fontweight='normal',
        verticalalignment='center', zorder=3)

# Tags
tags = ['Machine Learning', 'Data Engineering', 'GenAI', 'IoT']
x = 0.62
for tag in tags:
    ax.text(x, 1.2, tag,
            fontsize=11, color='#10b981', fontfamily='monospace',
            verticalalignment='center', zorder=3)
    # underline
    ax.plot([x, x + 0.08 * len(tag)], [1.0, 1.0],
            color='#10b981', linewidth=1, alpha=0.5, zorder=3)
    x += 0.08 * len(tag) + 0.6

# Bottom location
ax.text(0.62, 0.45, 'Douala, Cameroun  -  Disponible en remote',
        fontsize=11, color='#737373', fontfamily='monospace',
        verticalalignment='center', zorder=3)

# Right-side code block decoration
code_lines = [
    '> const olivier = {',
    '    role: "Data Scientist",',
    '    stack: ["Python",',
    '            "TensorFlow",',
    '            "LangChain",',
    '            "Power BI"],',
    '    open_to_work: true,',
    '    location: "Douala, CM"',
    '  };'
]
for i, line in enumerate(code_lines):
    ax.text(8.0, 5.0 - i * 0.45, line,
            fontsize=11, color='#525252', fontfamily='monospace',
            verticalalignment='center', zorder=3)

# Code block border
rect = patches.Rectangle((7.7, 0.8), 4.0, 4.7,
                          linewidth=1, edgecolor='#1f1f1f',
                          facecolor='#0f0f0f', zorder=1)
ax.add_patch(rect)

plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
plt.savefig('/home/z/my-project/public/og-image.png',
            facecolor='#0a0a0a', dpi=100, format='png')
plt.close()
print('OG image created: /home/z/my-project/public/og-image.png')
