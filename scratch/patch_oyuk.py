with open("1/yan.js", "r") as f:
    content = f.read()

# Replace coordinates for oyukArea
content = content.replace('oyukArea.style.width = "10%";', 'oyukArea.style.width = "8%";')
content = content.replace('oyukArea.style.height = "15%";', 'oyukArea.style.height = "8%";')
content = content.replace('oyukArea.style.left = "45%";', 'oyukArea.style.left = "72%";')
content = content.replace('oyukArea.style.top = "75%";', 'oyukArea.style.top = "86%";')

with open("1/yan.js", "w") as f:
    f.write(content)

print("Oyuk area patched")
