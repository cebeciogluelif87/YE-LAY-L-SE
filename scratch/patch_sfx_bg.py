for filename in ["styles.css", "1/styles.css", "2/styles.css"]:
    with open(filename, "a") as f:
        f.write("\n#sfxToggle { background: #ffffff !important; color: #000; border-color: #ffffff; margin-right: 8px; }\n")
    print(f"Patched {filename}")

