with open("1/yan.js", "r") as f:
    content = f.read()

content = content.replace(
    'if (ds && (state.sound || state.sfx))',
    'if (ds && state.sfx)'
)

with open("1/yan.js", "w") as f:
    f.write(content)

print("fixed dolap.mp3 state check")
