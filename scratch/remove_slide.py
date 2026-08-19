import re

files = ["1/styles.css", "2/styles.css"]

for file in files:
    try:
        with open(file, "r") as f:
            content = f.read()

        # Remove sliding animations
        content = re.sub(r'#app:has\(#dialogOverlay\.active\) #inventoryBar \{[^}]+\}', '', content)
        content = re.sub(r'\.visual-inventory\.hidden-right \{[^}]+\}', '', content)
        content = re.sub(r'transition: transform [^;]+;', '', content)
        content = re.sub(r'transform: translateX\(300px\);\s*opacity: 0;', '', content)

        with open(file, "w") as f:
            f.write(content)
        print(f"Removed animations from {file}")
    except Exception as e:
        print(e)

html_files = ["1/yan.html", "2/yan.html"]
for file in html_files:
    try:
        with open(file, "r") as f:
            content = f.read()

        content = re.sub(r'const invBar = document\.querySelector\("#inventoryBar"\);\s*if \(invBar\) invBar\.classList\.add\("hidden-right"\);', '', content)
        content = re.sub(r'const invBar = document\.querySelector\("#inventoryBar"\);\s*if \(invBar\) invBar\.classList\.remove\("hidden-right"\);', '', content)

        with open(file, "w") as f:
            f.write(content)
        print(f"Removed hidden-right toggles from {file}")
    except Exception as e:
        print(e)
