with open("1/yan.js", "r") as f:
    content = f.read()

content = content.replace(
    'dolapKulp.addEventListener("click", () => {',
    'dolapKulp.addEventListener("click", (e) => {\n                      e.stopPropagation();'
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("stopPropagation added to dolapKulp")
