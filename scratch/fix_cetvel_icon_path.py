with open("1/yan.js", "r") as f:
    content = f.read()

content = content.replace(
    '{ id: "cetvel", name: "Eski Cetvel", icon: "assets/cetvel.png" }',
    '{ id: "cetvel", name: "Eski Cetvel", icon: "assets/cetvel_ikon.png" }'
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("Icon path updated to cetvel_ikon.png")
