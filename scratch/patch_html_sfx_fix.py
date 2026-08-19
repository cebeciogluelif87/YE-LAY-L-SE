import re

for filename in ["ana.html", "1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    # If it's not already there
    if 'id="sfxToggle"' not in content:
        # We can just search for id="soundToggle" using regex to be safe
        content = re.sub(
            r'(<button[^>]*id="soundToggle"[^>]*>)',
            r'<button id="sfxToggle" aria-label="Efekt Sesi" style="font-size: 16px; background: none; border: 1px solid var(--line); color: var(--green); padding: 0 16px; cursor: pointer; border-radius: 4px; margin-right: 8px;">🎵</button>\n        \1',
            content
        )
        with open(filename, "w") as f:
            f.write(content)
        print(f"Patched {filename}")

