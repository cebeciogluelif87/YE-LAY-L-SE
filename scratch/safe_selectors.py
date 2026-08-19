import re

with open("1/yan.js", "r") as f:
    content = f.read()

def repl_selectors(m):
    return """  const stepInd = document.querySelector("#stepIndicator");
  if (stepInd) stepInd.textContent = `SAHNE ${scene + 1} / 4`;
  const prog = document.querySelector("#sceneProgress");
  if (prog) prog.style.width = `${(scene + 1) * 25}%`;"""

content = re.sub(
    r'  document\.querySelector\("#stepIndicator"\)\.textContent = `SAHNE \$\{scene \+ 1\} / 4`;\n  document\.querySelector\("#sceneProgress"\)\.style\.width = `\$\{\(scene \+ 1\) \* 25\}%`;',
    repl_selectors,
    content
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("1/yan.js selectors made safe")
