import re

for filename in ["ana.js", "1/yan.js", "2/yan.js"]:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Update defaultState to include sfx: true
    target_state = "const defaultState = { completed: [], evidence: [], questions: [], inventory: [], invScrollIndex: 0, lastSave: null, activeAct: 0, sound: true };"
    repl_state = "const defaultState = { completed: [], evidence: [], questions: [], inventory: [], invScrollIndex: 0, lastSave: null, activeAct: 0, sound: true, sfx: true };"
    
    if target_state in content:
        content = content.replace(target_state, repl_state)
    elif "sfx: true" not in content:
        # Fallback if the string doesn't exactly match
        content = content.replace("sound: true }", "sound: true, sfx: true }")

    # 2. Add global click listener for ok.mp3 interactions
    if "const isClickable =" not in content:
        listener = """
document.addEventListener("click", (e) => {
  if (!state.sfx) return;
  const isClickable = e.target.closest('button') || e.target.closest('a') || (window.getComputedStyle(e.target).cursor === 'pointer');
  if (isClickable) {
    const cs = document.getElementById('clickSound');
    if (cs) {
      cs.currentTime = 0;
      cs.play().catch(()=>{});
    }
  }
});
"""
        content = content + listener
        
    with open(filename, "w") as f:
        f.write(content)
        
    print(f"Patched missing logic in {filename}")

