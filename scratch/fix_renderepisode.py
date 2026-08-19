with open("1/yan.js", "r") as f:
    content = f.read()

# Revert the wrong replacements
content = content.replace('document.addEventListener("DOMContentLoaded", () => { renderEpisode(); });', 'renderEpisode();')

# Only wrap the LAST renderEpisode() in DOMContentLoaded
# The last one is at the very end of the file.
content = content.rstrip()
if content.endswith("renderEpisode();"):
    content = content[:-len("renderEpisode();")] + 'document.addEventListener("DOMContentLoaded", () => { renderEpisode(); });\n'

with open("1/yan.js", "w") as f:
    f.write(content)

print("1/yan.js fixed")
