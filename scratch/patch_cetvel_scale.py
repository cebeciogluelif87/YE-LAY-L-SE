with open("1/yan.js", "r") as f:
    content = f.read()

# Replace the transform string
content = content.replace('cetvel.style.transform = "scale(0.2) rotate(45deg)";', 'cetvel.style.transform = "rotate(45deg)";')

with open("1/yan.js", "w") as f:
    f.write(content)

print("cetvel scale patched")
