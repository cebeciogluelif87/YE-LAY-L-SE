import os

files = ["styles.css", "1/styles.css", "2/styles.css"]
for file in files:
    with open(file, "r") as f:
        content = f.read()
    
    # Change opacity of disabled arrows from 0.2 to 0.7 (or remove disabled style)
    content = content.replace(".visual-inventory .inv-arrow:disabled { opacity: 0.2;", ".visual-inventory .inv-arrow:disabled { opacity: 0.7;")
    
    with open(file, "w") as f:
        f.write(content)

print("Fixed arrow opacity")
