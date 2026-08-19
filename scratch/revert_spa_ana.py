import re

with open("ana.js", "r") as f:
    content = f.read()

# Replace startEpisode
def repl_start_episode(m):
    return """function startEpisode(num) {
  window.location.href = `${num}/yan.html`;
}"""

content = re.sub(r'function startEpisode\(num\) \{[\s\S]*?\}', repl_start_episode, content, count=1)

# Remove the message listener
content = re.sub(r'window\.addEventListener\("message",\s*\(event\)\s*=>\s*\{[\s\S]*?\}\);\n?', '', content)

with open("ana.js", "w") as f:
    f.write(content)

print("ana.js updated")
