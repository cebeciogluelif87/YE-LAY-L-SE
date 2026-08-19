import re

files = ["1/yan.html", "2/yan.html"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    add_code = 'dialogOverlay.classList.add("active");\n      const invBar = document.querySelector("#inventoryBar");\n      if (invBar) invBar.classList.add("hidden-right");'
    remove_code = 'dialogOverlay.classList.remove("active");\n          const invBar = document.querySelector("#inventoryBar");\n          if (invBar) invBar.classList.remove("hidden-right");'
    
    content = content.replace('dialogOverlay.classList.add("active");', add_code)
    content = content.replace('dialogOverlay.classList.remove("active");', remove_code)

    with open(file, "w") as f:
        f.write(content)

with open("1/styles.css", "a") as f:
    f.write("\n.visual-inventory.hidden-right { transform: translateX(300px); opacity: 0; }\n")

with open("2/styles.css", "a") as f:
    f.write("\n.visual-inventory.hidden-right { transform: translateX(300px); opacity: 0; }\n")

with open("styles.css", "a") as f:
    f.write("\n.visual-inventory.hidden-right { transform: translateX(300px); opacity: 0; }\n")

print("Added explicit JS classes for sliding")
