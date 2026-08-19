import re

for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Match and replace the font sizes to match styles.css
    content = content.replace("font-size: 16px;", "font-size: 20px;")
    content = content.replace("font-size: 12px;", "font-size: 16px;")
    content = content.replace("font-size: 14px;", "font-size: 18px;")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched fonts in {filename}")

