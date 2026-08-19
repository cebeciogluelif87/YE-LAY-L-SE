import re

for filename in ["ana.js", "1/yan.js", "2/yan.js"]:
    with open(filename, "r") as f:
        content = f.read()

    # Add sfx toggle updater in Chrome
    if 'sfxToggle.textContent = state.sfx' not in content:
        content = content.replace(
            'if (st) st.textContent = `SES: ${state.sound ? "AÇIK" : "KAPALI"}`;',
            'if (st) st.textContent = `SES: ${state.sound ? "AÇIK" : "KAPALI"}`;\n  const sfxBtn = document.querySelector("#sfxToggle");\n  if (sfxBtn) sfxBtn.textContent = state.sfx ? "🎵" : "🔇";'
        )
        
    # Add sfx listener
    if 'sfxBtn.addEventListener("click"' not in content:
        listener = """
const sfxBtn = document.querySelector("#sfxToggle");
if (sfxBtn) {
  sfxBtn.addEventListener("click", () => {
    state.sfx = !state.sfx;
    if (typeof updateChrome === "function") updateChrome();
    if (typeof save === "function") save();
  });
}
"""
        content = content + listener
        
    with open(filename, "w") as f:
        f.write(content)
        
    print(f"Patched {filename}")

