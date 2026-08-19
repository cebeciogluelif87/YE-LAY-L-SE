import re

with open("1/yan.js", "r") as f:
    content = f.read()

def repl_scene0(m):
    return """if (scene === 0) {
    stage.innerHTML = `
      <div class="story-scene" style="position:relative; width:100%; height:100%; background:black;">
        <img src="../assets/a1.png" alt="Arkaplan" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
      </div>
    `;

    setTimeout(() => {
      if (window.showDialog) {
        window.showDialog([
          "Ders zili, okulun o değişmez günlük intizamını bir kez daha başlattı.",
          "Kantin dakikalar içinde tanıdık bir curcunaya teslim olmuştu: masalara bırakılan tepsiler, telaşlı kahkahalar ve havada uçuşan dedikodular...",
          "Yeşiliz için burası yalnızca bir yemek salonu değil; insan tabiatının en tedbirsiz, en samimi anlarını izlediği sessiz bir köşeydi."
        ], null, () => {
          scene += 1;
          renderEpisode();
        });
      }
    }, 300);
  } else """

content = re.sub(r'if \(scene === 0\)\s*stage\.innerHTML = `[^`]+`;\s*', repl_scene0, content)

with open("1/yan.js", "w") as f:
    f.write(content)
print("1/yan.js updated for scene 0")
