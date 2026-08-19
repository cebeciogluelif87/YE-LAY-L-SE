files = ["ana.js", "1/yan.js", "2/yan.js"]

for file in files:
    with open(file, "r") as f:
        content = f.read()
    
    content = content.replace("const VISIBLE_SLOTS = 6;", "const VISIBLE_SLOTS = 5;")
    
    with open(file, "w") as f:
        f.write(content)

print("Slots updated")
