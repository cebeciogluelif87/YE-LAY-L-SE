with open("1/yan.js", "r") as f:
    content = f.read()

# For oyukArea
content = content.replace(
    'oyukArea.style.top = "75%";',
    'oyukArea.style.top = "75%";\n          oyukArea.style.border = "4px dashed red";\n          oyukArea.style.backgroundColor = "rgba(255, 0, 0, 0.3)";'
)

# For dolapKulp
content = content.replace(
    'dolapKulp.style.top = "40%";',
    'dolapKulp.style.top = "40%";\n                    dolapKulp.style.border = "4px dashed blue";\n                    dolapKulp.style.backgroundColor = "rgba(0, 0, 255, 0.3)";'
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("Hitboxes made visible")
