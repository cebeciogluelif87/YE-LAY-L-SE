with open("2/yan.html", "r") as f:
    content = f.read()

inventory_html = """
    <!-- Görsel Envanter (İpucu) Sistemi -->
    <div class="visual-inventory" id="inventoryBar">
      <img src="../assets/ipucu.png" class="inv-bg" alt="İpucu Çerçevesi">
      <button class="inv-arrow inv-up" id="invUpBtn" aria-label="Yukarı Kaydır">
        <img src="../assets/ust.png" alt="Yukarı Ok">
      </button>
      <div class="inv-carousel-mask">
        <div class="inv-carousel-track" id="inventorySlots">
          <!-- JS ile dinamik doldurulacak -->
        </div>
      </div>
      <button class="inv-arrow inv-down" id="invDownBtn" aria-label="Aşağı Kaydır">
        <img src="../assets/alt.png" alt="Aşağı Ok">
      </button>
    </div>
"""

# Find closing tag of #app
target = "  </div>\n\n  <div class=\"toast\""
if target in content:
    content = content.replace(target, inventory_html + target)
else:
    print("Could not find insertion point!")

with open("2/yan.html", "w") as f:
    f.write(content)

print("Injected HTML to 2/yan.html")
