for filename in ["styles.css", "1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Remove the background white rule I just added
    content = content.replace("\n#sfxToggle { background: #ffffff !important; color: #000; border-color: #ffffff; margin-right: 8px; }\n", "")

    # Add the text color white rule instead
    content += "\n#sfxToggle { color: #ffffff !important; margin-right: 8px; }\n"

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched {filename}")

