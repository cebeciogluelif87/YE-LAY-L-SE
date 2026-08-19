for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Revert overflow on slot back to hidden
    content = content.replace(
        "      overflow: visible;\n      pointer-events: auto;\n      z-index: 41;",
        "      overflow: hidden;\n      pointer-events: auto;\n      z-index: 41;"
    )
    content = content.replace(
        "      overflow: visible;\n", 
        ""
    )

    # Make image fill the slot fully with contain (no overflow, max size)
    content = content.replace(
        "    .inv-slot img {\n      width: 300px;\n      height: auto;\n      max-height: none;\n      object-fit: contain;",
        "    .inv-slot img {\n      width: 100%;\n      height: 100%;\n      object-fit: contain;"
    )

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched {filename}")

