with open("app.js", "r") as f:
    content = f.read()

# 1. Update defaultState
target1 = "const defaultState = { completed: [], evidence: [], questions: [], lastSave: null, activeAct: 0, sound: true };"
repl1 = "const defaultState = { completed: [], evidence: [], questions: [], lastSave: null, activeAct: 0, sound: true, sfx: true };"
content = content.replace(target1, repl1)

# 2. Update Chrome logic
target2 = 'document.querySelector("#soundToggle").textContent = `SES: ${state.sound ? "AÇIK" : "KAPALI"}`;'
repl2 = """document.querySelector("#soundToggle").textContent = `SES: ${state.sound ? "AÇIK" : "KAPALI"}`;
  const sfxToggle = document.querySelector("#sfxToggle");
  if (sfxToggle) sfxToggle.textContent = state.sfx ? "🎵" : "🔇";"""
content = content.replace(target2, repl2)

# 3. Handle global click logic (ok.mp3)
target3 = """document.addEventListener("click", (e) => {
  if (!state.sound) return;"""
repl3 = """document.addEventListener("click", (e) => {
  if (!state.sfx) return;"""
content = content.replace(target3, repl3)

with open("app.js", "w") as f:
    f.write(content)

print("app.js patched for sfx")
