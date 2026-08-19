import re

for filename in ["ana.html", "1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    # Replace the inline styled sfxToggle with a clean one using icon-button
    content = re.sub(
        r'<button id="sfxToggle" [^>]*>🎵</button>',
        r'<button class="icon-button" id="sfxToggle" aria-label="Efekt Sesi">🎵</button>',
        content
    )

    with open(filename, "w") as f:
        f.write(content)
    print(f"Patched sfx button style in {filename}")

