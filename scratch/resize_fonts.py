import re
import sys

def increase_font_size(match):
    prefix = match.group(1)
    size = int(match.group(2))
    suffix = match.group(3)
    new_size = size + 4 # 3 punto ~ 4px
    return f"{prefix}{new_size}{suffix}"

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Match font-size: 14px; or font: 16px
    # Regex for font-size: \d+px
    content = re.sub(r'(font-size:\s*)(\d+)(px)', increase_font_size, content)
    # Regex for font: ... 16px
    content = re.sub(r'(font:\s*(?:[^;}]*\s)?)(\d+)(px)', increase_font_size, content)

    with open(filepath, 'w') as f:
        f.write(content)

process_file('styles.css')
process_file('1/yan.html')
process_file('ana.html')
print("Font sizes increased.")
