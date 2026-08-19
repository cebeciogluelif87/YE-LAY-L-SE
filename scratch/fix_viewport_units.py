import re

files = ["styles.css", "1/styles.css", "2/styles.css"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Replacements for vh
    content = content.replace("100vh", "1080px")
    content = content.replace("8vh", "86px")
    content = content.replace("7vh", "75px")
    content = content.replace("6vh", "64px")
    content = content.replace("5vh", "54px")
    content = content.replace("4vh", "43px")
    
    # Replacements for vw
    content = content.replace("4vw", "76px")
    content = content.replace("5vw", "96px")
    content = content.replace("6vw", "115px")
    content = content.replace("7vw", "134px")
    content = content.replace("68vw", "1305px")

    # Replacements for clamp()
    content = content.replace("clamp(56px, 6.5vw, 109px)", "109px")
    content = content.replace("clamp(56px,6.5vw,109px)", "109px")
    
    content = content.replace("clamp(43px, 5vw, 70px)", "70px")
    content = content.replace("clamp(43px,5vw,70px)", "70px")
    
    content = content.replace("clamp(16px, 1.5vw, 24px)", "24px")
    content = content.replace("clamp(16px,1.5vw,24px)", "24px")
    
    content = content.replace("clamp(27px, 3vw, 44px)", "44px")
    content = content.replace("clamp(27px,3vw,44px)", "44px")
    
    with open(file, "w") as f:
        f.write(content)

print("Viewport units fixed")
