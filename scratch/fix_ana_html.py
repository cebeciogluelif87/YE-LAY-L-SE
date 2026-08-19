with open("ana.html", "r") as f:
    content = f.read()

content = content.replace('<!-- Replaced original audio tag to prevent duplicates --> src="assets/gizem.mp3" preload="auto" loop></audio>', '')

with open("ana.html", "w") as f:
    f.write(content)
print("fixed")
