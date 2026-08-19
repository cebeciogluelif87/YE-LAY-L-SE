for filename in ["1/yan.html", "2/yan.html"]:
    with open(filename, "r") as f:
        content = f.read()

    sound_logic = "const cs = document.getElementById('clickSound'); if (cs && state.sound) { cs.currentTime = 0; cs.play().catch(()=>{}); }"
    
    # Next btn
    old_next = """      dialogNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentDialogIndex < currentDialogSequence.length - 1) {"""
    new_next = f"""      dialogNextBtn.addEventListener("click", (e) => {{
        e.stopPropagation();
        {sound_logic}
        if (currentDialogIndex < currentDialogSequence.length - 1) {{"""
    content = content.replace(old_next, new_next)
    
    # Prev btn
    old_prev = """      dialogPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentDialogIndex > 0) {"""
    new_prev = f"""      dialogPrevBtn.addEventListener("click", (e) => {{
        e.stopPropagation();
        {sound_logic}
        if (currentDialogIndex > 0) {{"""
    content = content.replace(old_prev, new_prev)
    
    # Overlay click
    old_overlay = """      dialogOverlay.addEventListener("click", () => {
        if (currentDialogIndex < currentDialogSequence.length - 1) {"""
    new_overlay = f"""      dialogOverlay.addEventListener("click", () => {{
        {sound_logic}
        if (currentDialogIndex < currentDialogSequence.length - 1) {{"""
    content = content.replace(old_overlay, new_overlay)

    with open(filename, "w") as f:
        f.write(content)

print("Sounds added")
