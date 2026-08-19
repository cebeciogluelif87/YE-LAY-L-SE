for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    content = content.replace(
        "    .inv-slot img {\n      width: 100%;\n      height: 100%;\n      object-fit: contain;",
        "    .inv-slot img {\n      width: 80%;\n      height: 80%;\n      object-fit: contain;"
    )

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched {filename}")

