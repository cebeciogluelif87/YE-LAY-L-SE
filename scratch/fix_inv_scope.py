with open("1/yan.html", "r") as f:
    content = f.read()

# Make updateInventoryUI and save globally accessible
content = content.replace(
    "    function updateInventoryUI() {",
    "    window.updateInventoryUI = function updateInventoryUI() {"
)

# Also expose save if it's defined here
if "function save()" in content and "window.save = " not in content:
    content = content.replace("    function save()", "    window.save = function save()")

with open("1/yan.html", "w") as f:
    f.write(content)

print("Done — updateInventoryUI is now window-scoped")
