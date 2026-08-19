import re

with open("ana.html", "r") as f:
    content = f.read()

# Remove the gameIframeContainer
content = re.sub(r'\s*<div id="gameIframeContainer" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; background:#000;">\s*<iframe id="gameFrame" src="" style="width:100%; height:100%; border:none;"></iframe>\s*</div>', '', content)

# Remove the gameMusic audio tag
content = re.sub(r'\s*<audio id="gameMusic" src="assets/gizem2\.mp3" preload="auto" loop></audio>', '', content)

with open("ana.html", "w") as f:
    f.write(content)

print("ana.html cleaned")
