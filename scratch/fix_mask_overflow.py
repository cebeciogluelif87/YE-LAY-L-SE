for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    content = content.replace(
        "      overflow: hidden;\n      pointer-events: auto;\n      z-index: 41;",
        "      overflow: visible;\n      pointer-events: auto;\n      z-index: 41;"
    )

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched {filename}")

