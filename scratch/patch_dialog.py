for filename in ["1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    old_logic = "dialogTextElement.textContent = text;"
    new_logic = """dialogTextElement.textContent = text;
      
      if (text.includes("Ayakkabısının tabanında hafif bir oynama") && state.sound) {
        const ts = document.getElementById("tahtaSound");
        if (ts) { ts.currentTime = 0; ts.play().catch(()=>{}); }
      }"""
      
    content = content.replace(old_logic, new_logic)

    with open(filename, "w") as f:
        f.write(content)

print("Text trigger patched")
