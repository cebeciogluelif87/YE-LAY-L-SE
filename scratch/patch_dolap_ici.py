with open("1/yan.js", "r") as f:
    content = f.read()

# Replace coordinates for dolapIci
content = content.replace('dolapIci.style.width = "30%";', 'dolapIci.style.width = "12%";')
content = content.replace('dolapIci.style.height = "60%";', 'dolapIci.style.height = "45%";')
content = content.replace('dolapIci.style.left = "35%";', 'dolapIci.style.left = "77%";')
# top is already 25% in the previous patch

with open("1/yan.js", "w") as f:
    f.write(content)

print("dolapIci area patched")
