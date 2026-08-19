for filename in ["1/styles.css", "2/styles.css"]:
    with open(filename, "r") as f:
        content = f.read()

    # Make episode-view static and overflow visible
    content = content.replace("position: relative; overflow: hidden;", "position: static; overflow: visible;")

    # Replace #roomStage styles
    old_room = """#roomStage {
  position: relative;
  width: 100%;
  height: 924px;
  overflow: hidden;
}"""
    
    new_room = """#roomStage {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  z-index: 0;
}"""

    content = content.replace(old_room, new_room)

    with open(filename, "w") as f:
        f.write(content)

print("Fullscreen patched")
