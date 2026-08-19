with open("app.js", "r") as f:
    content = f.read()

# Replace the specific global click listener condition
old_listener = """document.addEventListener("click", (e) => {
  if (!state.sound) return;
  const cs = document.getElementById('clickSound');
  if (cs) {
    cs.currentTime = 0;
    cs.play().catch(()=>{});
  }
});"""

new_listener = """document.addEventListener("click", (e) => {
  if (!state.sound) return;
  const isClickable = e.target.closest('button') || e.target.closest('a') || (window.getComputedStyle(e.target).cursor === 'pointer');
  if (isClickable) {
    const cs = document.getElementById('clickSound');
    if (cs) {
      cs.currentTime = 0;
      cs.play().catch(()=>{});
    }
  }
});"""

content = content.replace(old_listener, new_listener)

with open("app.js", "w") as f:
    f.write(content)

print("Reverted to interaction clicks")
