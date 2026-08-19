with open("1/yan.html", "r") as f:
    content = f.read()

# 1. Add selectedItem declaration before updateInventoryUI
content = content.replace(
    "    const VISIBLE_SLOTS = 6;\n\n    window.updateInventoryUI",
    "    const VISIBLE_SLOTS = 6;\n    let selectedItem = null;\n\n    window.updateInventoryUI"
)

with open("1/yan.html", "w") as f:
    f.write(content)

print("selectedItem declared in yan.html")

# 2. Fix cling.mp3 path in yan.js
with open("1/yan.js", "r") as f:
    content = f.read()

content = content.replace(
    "const clingSound = new Audio('assets/cling.mp3');",
    "const clingSound = new Audio('../assets/cling.mp3');"
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("cling.mp3 path fixed in yan.js")
