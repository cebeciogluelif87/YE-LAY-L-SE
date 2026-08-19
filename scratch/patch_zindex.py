for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Replace z-index: 10 with z-index: 70 for .topbar
    content = content.replace("position: relative; z-index: 10;", "position: relative; z-index: 70;")

    with open(filename, "w") as f:
        f.write(content)

print("z-index patched")
