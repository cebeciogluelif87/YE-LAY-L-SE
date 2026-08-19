import os
files = ["styles.css", "1/styles.css", "2/styles.css"]

for file in files:
    with open(file, "r") as f:
        content = f.read()
    
    content = content.replace("border: 1px solid rgba(104,239,154,.6); transform: rotate(45deg);", "")
    content = content.replace("transform: rotate(-45deg); ", "")
    
    with open(file, "w") as f:
        f.write(content)

print("Logo fixed")
