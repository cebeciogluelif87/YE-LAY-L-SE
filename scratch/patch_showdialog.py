import re

for filename in ["1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()
    
    # Replace function signature
    content = content.replace(
        "function showDialog(sequence, portraitSrc = null, onComplete = null) {",
        "function showDialog(sequence, portraitSrc = null, onComplete = null, bgType = \"konusma\") {"
    )
    
    # Add bg update
    bg_update = """      currentDialogSequence = sequence;
      const bgImg = document.querySelector("#dialogBgImg");
      if (bgImg) bgImg.src = `../assets/${bgType}.png`;"""
      
    content = content.replace("      currentDialogSequence = sequence;", bg_update)
    
    with open(filename, "w") as f:
        f.write(content)

print("showDialog patched")
