for filename in ["ana.js", "1/yan.js", "2/yan.js"]:
    with open(filename, "r") as f:
        content = f.read()

    # Change the state logic
    content = content.replace(
        'if (sfxBtn) sfxBtn.textContent = state.sfx ? "♫" : "🔇";',
        'if (sfxBtn) { sfxBtn.textContent = "♫"; sfxBtn.classList.toggle("muted", !state.sfx); }'
    )
    with open(filename, "w") as f:
        f.write(content)

for filename in ["styles.css", "1/styles.css", "2/styles.css"]:
    with open(filename, "a") as f:
        f.write("""
#sfxToggle { position: relative; }
#sfxToggle.muted::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 15%;
  right: 15%;
  height: 2px;
  background-color: red;
  transform: translateY(-50%) rotate(-45deg);
  pointer-events: none;
}
""")
    print(f"Patched {filename}")

