import re

for filename in ["1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Add currentBgType
    if "let currentBgType =" not in content:
        content = content.replace("let currentPortraitSrc = null;", "let currentPortraitSrc = null;\n    let currentBgType = \"konusma\";")
        
    # 2. Update showDialog
    if "currentBgType = bgType;" not in content:
        content = content.replace(
            'function showDialog(sequence, portraitSrc = null, onComplete = null, bgType = "konusma") {\n      dialogCallback = onComplete;',
            'function showDialog(sequence, portraitSrc = null, onComplete = null, bgType = "konusma") {\n      dialogCallback = onComplete;\n      currentBgType = bgType;'
        )
        
    # 3. Update renderDialogState
    old_render = """      const text = currentDialogSequence[currentDialogIndex];
      dialogTextElement.innerHTML = text;"""
    new_render = """      let text = currentDialogSequence[currentDialogIndex];
      if (currentBgType === "konusma") {
        text = `<i>"${text}"</i>`;
      }
      dialogTextElement.innerHTML = text;"""
    
    content = content.replace(old_render, new_render)

    with open(filename, "w") as f:
        f.write(content)

print("HTML patched for konusma italics")
