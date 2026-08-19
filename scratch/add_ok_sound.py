import re

files = ["1/yan.js", "2/yan.js"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    sound_function = """
function playClickSound() {
  if (!state.sound) return;
  const audio = new Audio("../assets/ok.mp3");
  audio.play().catch(() => {});
}
"""
    if "playClickSound" not in content:
        content = content.replace("function fitGameStage() {", sound_function + "\nfunction fitGameStage() {")

    # Add listeners to invUpBtn and invDownBtn
    # We can inject this into the updateInventoryUI function since the buttons are queried there,
    # or just add it globally in the initialization.
    # It's better to add it at the bottom initialization logic.
    init_logic = """
    // Add sound effects to arrows
    const arrowIds = ["#invUpBtn", "#invDownBtn", "#dialogPrevBtn", "#dialogNextBtn"];
    arrowIds.forEach(id => {
      const btn = document.querySelector(id);
      if (btn) btn.addEventListener("click", playClickSound);
    });
"""
    if 'arrowIds.forEach' not in content:
        content = content.replace('// 1. Adımı Başlat', init_logic + '\n    // 1. Adımı Başlat')

    with open(file, "w") as f:
        f.write(content)

print("Sound added to buttons")
