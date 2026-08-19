for filename in ["1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    # The current string match is text.includes("kuru bir tıkırtı hissetti")
    # Change to "bir tıkırtı hissetti"
    content = content.replace('text.includes("kuru bir tıkırtı hissetti")', 'text.includes("bir tıkırtı hissetti")')

    with open(filename, "w") as f:
        f.write(content)

print("Trigger condition updated")
