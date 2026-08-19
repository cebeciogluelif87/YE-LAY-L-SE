import re

with open("ana.html", "r") as f:
    ana_html = f.read()

# Add iframe container right before closing #app
iframe_container = """
    <!-- Oyun Iframe Container -->
    <div id="gameIframeContainer" style="display: none; position: absolute; inset: 0; z-index: 9999;">
      <iframe id="gameFrame" src="" style="width: 100%; height: 100%; border: none;"></iframe>
    </div>
"""
if 'id="gameIframeContainer"' not in ana_html:
    ana_html = ana_html.replace('</main>', '</main>\n' + iframe_container)

with open("ana.html", "w") as f:
    f.write(ana_html)


with open("ana.js", "r") as f:
    ana_js = f.read()

# Change window.location.href = `${num}/yan.html` to show iframe
ana_js = ana_js.replace('window.location.href = `${num}/yan.html`;', '''
  const frameContainer = document.getElementById("gameIframeContainer");
  const frame = document.getElementById("gameFrame");
  frame.src = `${num}/yan.html`;
  frameContainer.style.display = "block";
''')

# Add postMessage listener in ana.js
post_message_listener = """
window.addEventListener("message", (event) => {
  if (event.data.type === "NAVIGATE") {
    const frameContainer = document.getElementById("gameIframeContainer");
    const frame = document.getElementById("gameFrame");
    frameContainer.style.display = "none";
    frame.src = "";
    navigate(event.data.target);
  } else if (event.data.type === "PLAY_MUSIC") {
    state.sound = true;
    startAmbientMusic();
    saveState();
  } else if (event.data.type === "PAUSE_MUSIC") {
    state.sound = false;
    if (ambientMusic) ambientMusic.pause();
    saveState();
  }
});
"""
if 'event.data.type === "NAVIGATE"' not in ana_js:
    ana_js += "\n" + post_message_listener

with open("ana.js", "w") as f:
    f.write(ana_js)

print("ana.html and ana.js updated for iframe SPA")
