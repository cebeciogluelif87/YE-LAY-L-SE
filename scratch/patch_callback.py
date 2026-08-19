for filename in ["1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    # Find the problematic callback execution in dialogNextBtn and dialogOverlay
    old_logic = "if (dialogCallback) { dialogCallback(); dialogCallback = null; }"
    new_logic = "if (dialogCallback) { const cb = dialogCallback; dialogCallback = null; cb(); }"

    content = content.replace(old_logic, new_logic)

    with open(filename, "w") as f:
        f.write(content)

print("Callback logic patched")
