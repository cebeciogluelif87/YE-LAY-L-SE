for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Allow inv-slot to overflow so wider items like cetvel can show
    content = content.replace(
        "    .inv-slot {\n      width: 160px;\n      height: 160px;\n      border-radius: 8px;\n      display: grid;\n      place-items: center;",
        "    .inv-slot {\n      width: 160px;\n      height: 160px;\n      border-radius: 8px;\n      display: grid;\n      place-items: center;\n      overflow: visible;"
    )

    # Make inv-slot img bigger: 200% width, auto height, centered
    content = content.replace(
        "    .inv-slot img {\n      max-width: 95%;\n      max-height: 95%;\n      object-fit: contain;",
        "    .inv-slot img {\n      width: 300px;\n      height: auto;\n      max-height: none;\n      object-fit: contain;"
    )

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched {filename}")

