with open("1/yan.js", "r") as f:
    content = f.read()

# Replace the specific strings
content = content.replace(
    '"<i>\\"Bu ses tanıdık değil. Zemin burada hep düz olurdu.\\"</i>"',
    '"Bu ses tanıdık değil. Zemin burada hep düz olurdu."'
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("Explicit italics removed")
