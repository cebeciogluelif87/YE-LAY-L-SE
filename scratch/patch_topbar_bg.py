for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Find the topbar class
    target = ".topbar { height: 82px;"
    replacement = ".topbar { background: #07130f; height: 82px;"

    content = content.replace(target, replacement)

    with open(filename, "w") as f:
        f.write(content)

print("Topbar bg patched")
