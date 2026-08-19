import re

files = ["styles.css", "1/styles.css", "2/styles.css"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Replace .inv-up
    content = re.sub(r'\.inv-up\s*\{[^}]*\}', '.inv-up { top: 155px; left: 1740px; width: 140px; height: 60px; }', content)
    # Replace .inv-down
    content = re.sub(r'\.inv-down\s*\{[^}]*\}', '.inv-down { top: 870px; left: 1740px; width: 140px; height: 60px; }', content)
    # Replace .inv-carousel-mask
    content = re.sub(r'\.inv-carousel-mask\s*\{[^}]*\}', '.inv-carousel-mask {\n      position: absolute;\n      top: 220px;\n      left: 1753px;\n      width: 118px;\n      height: 640px;\n      overflow: hidden;\n      pointer-events: auto;\n      z-index: 41;\n    }', content)

    with open(file, "w") as f:
        f.write(content)

print("Layout updated!")
