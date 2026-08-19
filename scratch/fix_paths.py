import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    content = content.replace('url("assets/', 'url("../assets/')
    content = content.replace('src="assets/', 'src="../assets/')
    content = content.replace('icon: "assets/', 'icon: "../assets/')
    content = content.replace("icon: 'assets/", "icon: '../assets/")

    with open(filepath, 'w') as f:
        f.write(content)

process_file('1/yan.html')
print("Paths fixed in 1/yan.html")
