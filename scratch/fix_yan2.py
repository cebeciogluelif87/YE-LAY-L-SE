import re
with open("2/yan.js", "r") as f:
    content = f.read()

content = content.replace('});\n}', '}')

with open("2/yan.js", "w") as f:
    f.write(content)
print("fixed")
