for filename in ["ana.html", "1/yan.html", "2/yan.html", "ana.js", "1/yan.js", "2/yan.js"]:
    with open(filename, "r") as f:
        content = f.read()

    content = content.replace("🎵", "♫")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched {filename}")

