with open("app.js", "r") as f:
    content = f.read()

# Add global click listener at the end of the file
listener = """
document.addEventListener("click", (e) => {
  if (!state.sound) return;
  const isClickable = e.target.closest('button') || e.target.closest('a') || (window.getComputedStyle(e.target).cursor === 'pointer');
  if (isClickable) {
    const cs = document.getElementById('clickSound');
    if (cs) {
      // Don't restart if it's already playing unless it's a new click? 
      // Actually, setting currentTime = 0 ensures fast repeated clicks sound good.
      cs.currentTime = 0;
      cs.play().catch(()=>{});
    }
  }
});
"""

if "clickSound" not in content:
    with open("app.js", "a") as f:
        f.write(listener)
    print("Global listener added")
else:
    print("Already added")
