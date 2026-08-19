for filename in ["1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    old_logic = """      if (text.includes("Ayakkabısının tabanında hafif bir oynama") && state.sound) {
        const ts = document.getElementById("tahtaSound");
        if (ts) { ts.currentTime = 0; ts.play().catch(()=>{}); }
      }"""
    
    new_logic = """      if (text.includes("kuru bir tıkırtı hissetti") && state.sound) {
        const ts = document.getElementById("tahtaSound");
        if (ts) { 
          ts.currentTime = 0; 
          ts.play().then(() => console.log("tahta.mp3 played successfully.")).catch(e => {
            console.error("tahtaSound playback failed:", e);
            alert("Ses dosyası oynatılamadı! (Belki format veya yol hatalıdır) Hata: " + e.message);
          });
        } else {
          console.error("tahtaSound element not found!");
          alert("tahtaSound element not found!");
        }
      }"""
      
    content = content.replace(old_logic, new_logic)

    with open(filename, "w") as f:
        f.write(content)

print("Sound debug patched")
