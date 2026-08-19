with open("1/yan.js", "r") as f:
    content = f.read()

scene0_end = """    }, 300);
  }"""

scene1_code = """

  if (scene === 1) {
    stage.innerHTML = `
      <div class="story-scene" style="position:relative; width:100%; height:100%; background:black;">
        <img src="assets/a2.png" alt="Arkaplan" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
      </div>
    `;

    setTimeout(() => {
      if (typeof showDialog !== "undefined") {
        showDialog([
          "Kantinin dip köşesindeki o eski, tozlu dolabın önünden geçerken birden duraksadı.",
          "Ayakkabısının tabanında hafif bir oynama ve ardından kuru bir tıkırtı hissetti.",
          "Kalabalıkta kimsenin duymayacağı ama onun dikkatinden kaçmayan bir ses..."
        ], null, () => {
          scene += 1;
          renderEpisode();
        }, "metin");
      }
    }, 300);
  }"""

if "scene === 1" not in content:
    content = content.replace(scene0_end, scene0_end + scene1_code)
    with open("1/yan.js", "w") as f:
        f.write(content)
    print("Scene 1 added successfully.")
else:
    print("Scene 1 already exists.")
