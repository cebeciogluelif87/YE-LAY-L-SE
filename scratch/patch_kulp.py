with open("1/yan.js", "r") as f:
    content = f.read()

# Replace coordinates for dolapKulp
content = content.replace('dolapKulp.style.width = "8%";', 'dolapKulp.style.width = "3%";')
content = content.replace('dolapKulp.style.height = "12%";', 'dolapKulp.style.height = "8%";')
content = content.replace('dolapKulp.style.left = "60%";', 'dolapKulp.style.left = "74.5%";')
content = content.replace('dolapKulp.style.top = "40%";', 'dolapKulp.style.top = "48%";')

with open("1/yan.js", "w") as f:
    f.write(content)

print("Kulp area patched")
