import re

with open("1/yan.html", "r") as f:
    content = f.read()

# We want to remove all the old renderStep functions and event listeners related to them.
# We will keep the dialog logic, navigation logic, and setup logic.

# Let's find the start of the game logic to remove
start_str = "/* 1. ADIM: KANTİN GENEL KEŞİF SAHNESİ */"
end_str = "/* 4. ADIM: SORUŞTURMA RAPORU & İZ DEFTERİNE KAYIT */"

# Let's just use regex to remove from start_str up to the end of renderStep4
content = re.sub(r'/\* 1\. ADIM: KANTİN GENEL KEŞİF SAHNESİ \*/[\s\S]*?function renderStep4\(\) \{[\s\S]*?\}\n', '', content)

# Remove the call to renderStep1(); at the bottom
content = content.replace("renderStep1();", "")
content = content.replace("let currentStep = 1;", "")
content = content.replace("let selectedItem = null;", "")

with open("1/yan.html", "w") as f:
    f.write(content)

print("1/yan.html cleaned")
