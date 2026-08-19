for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Add transition to .visual-inventory
    old_css = """    .visual-inventory {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 40;
    }"""
    
    new_css = """    .visual-inventory {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 40;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }"""
    
    content = content.replace(old_css, new_css)
    
    # Add hiding rule if not present
    if "#app:has(#dialogOverlay.active) #inventoryBar" not in content:
        content += "\n#app:has(#dialogOverlay.active) #inventoryBar {\n  transform: translateX(400px);\n  opacity: 0;\n}\n"
        
    with open(filename, "w") as f:
        f.write(content)

print("Slide animations restored")
