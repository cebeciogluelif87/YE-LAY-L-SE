import re

files = ["1/yan.html", "2/yan.html"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Remove function showToast(msg) { ... }
    content = re.sub(r'\s*function showToast\(msg\) \{[\s\S]*?\}\n', '', content)

    # Remove function save() { ... } 
    # Wait, in the earlier replacement I changed saveState() to save(). 
    # Let's remove function save() { ... }
    content = re.sub(r'\s*function save\(\) \{[\s\S]*?localStorage\.setItem[\s\S]*?\}\n', '', content)

    # Remove function fitGameStage() { ... }
    content = re.sub(r'\s*function fitGameStage\(\) \{[\s\S]*?\}\n', '', content)

    with open(file, "w") as f:
        f.write(content)

print("Duplicate functions removed")
