for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    content = content.replace(
        "position: absolute;\n  top: 0;\n  left: 0;",
        "position: absolute;\n  top: -92px;\n  left: 0;"
    )

    with open(filename, "w") as f:
        f.write(content)

print("Room top patched")
