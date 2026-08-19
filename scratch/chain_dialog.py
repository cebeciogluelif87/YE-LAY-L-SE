with open("1/yan.js", "r") as f:
    content = f.read()

old_callback = """        ], null, () => {
          scene += 1;
          renderEpisode();
        }, "metin");"""

new_callback = """        ], null, () => {
          showDialog([
            "<i>Bu ses tanıdık değil. Zemin burada hep düz olurdu.</i>"
          ], "assets/yesil-iz-portrait.png", () => {
            scene += 1;
            renderEpisode();
          }, "konusma");
        }, "metin");"""

content = content.replace(old_callback, new_callback)

with open("1/yan.js", "w") as f:
    f.write(content)

print("Callback chained")
