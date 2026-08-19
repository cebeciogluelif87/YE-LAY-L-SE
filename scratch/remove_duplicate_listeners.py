import re

files = ["1/yan.html", "2/yan.html"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Remove the soundToggle logic
    content = re.sub(r'const soundToggle = document\.querySelector\("#soundToggle"\);\s*if \(soundToggle\) \{[\s\S]*?\}\s*saveState\(\);\s*\}\);\s*\}', '', content)
    
    # Remove the fullscreenToggle logic
    content = re.sub(r'const fullscreenToggle = document\.querySelector\("#fullscreenToggle"\);\s*if \(fullscreenToggle\) \{[\s\S]*?\}\);\s*\}', '', content)

    with open(file, "w") as f:
        f.write(content)

print("Duplicate listeners removed")
