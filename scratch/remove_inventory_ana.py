import re

with open("ana.html", "r") as f:
    content = f.read()

# Replace the specific injected block
block_to_remove = """    <!-- Görsel Envanter (İpucu) Sistemi -->
    <div class="visual-inventory" id="inventoryBar">
      <img src="assets/ipucu.png" class="inv-bg" alt="İpucu Çerçevesi">
      <button class="inv-arrow inv-up" id="invUpBtn" aria-label="Yukarı Kaydır">
        <img src="assets/ust.png" alt="Yukarı Ok">
      </button>
      <div class="inv-carousel-mask">
        <div class="inv-carousel-track" id="inventorySlots">
          <!-- JS ile dinamik doldurulacak -->
        </div>
      </div>
      <button class="inv-arrow inv-down" id="invDownBtn" aria-label="Aşağı Kaydır">
        <img src="assets/alt.png" alt="Aşağı Ok">
      </button>
    </div>
"""

# Wait, sed might have messed up ana.html. Let's check what it looks like.
