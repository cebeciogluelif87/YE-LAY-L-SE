import re

for filename in ["ana.html", "1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    # Find the sound toggle button
    target = '<button id="soundToggle"'
    if 'id="sfxToggle"' not in content:
        # Add sfx toggle before it
        repl = '<button id="sfxToggle" aria-label="Efekt Sesi" style="font-size: 16px;">🎵</button>\n        <button id="soundToggle"'
        content = content.replace(target, repl)

        with open(filename, "w") as f:
            f.write(content)
        print(f"Patched {filename}")

