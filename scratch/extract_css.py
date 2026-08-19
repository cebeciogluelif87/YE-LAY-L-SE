import re

with open("1/yan.html", "r") as f:
    content = f.read()

# Extract lines 107 to 204
lines = content.split('\n')
css_block = '\n'.join(lines[106:204])

# Remove from 1/yan.html
new_content = '\n'.join(lines[:106] + lines[204:])
with open("1/yan.html", "w") as f:
    f.write(new_content)

# Append to styles.css
with open("styles.css", "a") as f:
    f.write('\n\n' + css_block + '\n')

print("CSS moved.")
