import re
with open("1/yan.html", "r") as f:
    content = f.read()
match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if match:
    with open("scratch/inline.js", "w") as f:
        # mock globals
        f.write("let state = {sound: true};\nlet selectedItem = null;\n" + match.group(1))
    print("Extracted script.")
else:
    print("Script not found.")
