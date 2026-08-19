for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Make slot bigger - 180x180 to be more visible
    content = content.replace(
        "    .inv-slot {\n      width: 118px;\n      height: 118px;",
        "    .inv-slot {\n      width: 160px;\n      height: 160px;"
    )
    # Make image fill most of the slot
    content = content.replace(
        "    .inv-slot img {\n      max-width: 80%;\n      max-height: 80%;",
        "    .inv-slot img {\n      max-width: 95%;\n      max-height: 95%;"
    )
    # Update carousel track gap
    content = content.replace(
        "      gap: 18px; /* Space between slots */",
        "      gap: 8px; /* Space between slots */"
    )

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched {filename}")

# Also update the carousel mask size in styles.css to match
for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()
    
    content = content.replace(
        "      width: 118px;\n      height: 640px;",
        "      width: 160px;\n      height: 640px;"
    )
    
    with open(filename, "w") as f:
        f.write(content)
    print(f"Mask updated in {filename}")

# Update inv-up/inv-down positions
for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()
    
    content = content.replace(
        "    .inv-up { top: 155px; left: 1740px; width: 140px; height: 60px; }",
        "    .inv-up { top: 155px; left: 1720px; width: 160px; height: 60px; }"
    )
    content = content.replace(
        "    .inv-down { top: 870px; left: 1740px; width: 140px; height: 60px; }",
        "    .inv-down { top: 870px; left: 1720px; width: 160px; height: 60px; }"
    )
    # Update mask left to center
    content = content.replace(
        "      top: 220px;\n      left: 1753px;",
        "      top: 220px;\n      left: 1733px;"
    )
    
    with open(filename, "w") as f:
        f.write(content)

print("Done")
