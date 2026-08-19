with open("1/yan.js", "r") as f:
    content = f.read()

# Update animation target coordinates to match updated slot position
content = content.replace(
    '                            cetvel.style.left = "1753px";\n                            cetvel.style.top = "220px";',
    '                            cetvel.style.left = "1733px";\n                            cetvel.style.top = "220px";'
)
content = content.replace(
    '                            cetvel.style.width = "118px";\n                            cetvel.style.height = "118px";',
    '                            cetvel.style.width = "160px";\n                            cetvel.style.height = "160px";'
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("Animation coords updated")
