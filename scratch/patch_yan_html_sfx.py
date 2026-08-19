with open("1/yan.html", "r") as f:
    content = f.read()

# Replace state.sound with state.sfx for click events inside HTML
content = content.replace("const cs = document.getElementById('clickSound'); if (cs && state.sound)", "const cs = document.getElementById('clickSound'); if (cs && state.sfx)")

with open("1/yan.html", "w") as f:
    f.write(content)

print("yan.html sfx logic patched")
