import re

files = ["1/yan.html", "2/yan.html"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Remove defaultState, state, try/catch, toast
    content = re.sub(r'const defaultState = \{[^}]*\};\n\s*let state;\n\s*try \{ state = [^\n]*\n\s*catch \{ state = [^\n]*\n', '', content)
    content = re.sub(r'const toast = document\.querySelector\("#toast"\);\n', '', content)

    # Change saveState() to save()
    content = content.replace('saveState()', 'save()')

    with open(file, "w") as f:
        f.write(content)

js_files = ["1/yan.js", "2/yan.js"]
for js in js_files:
    with open(js, "r") as f:
        js_content = f.read()
    
    # Update defaultState to include inventory
    js_content = js_content.replace(
        'const defaultState = { completed: [], evidence: [], questions: [], lastSave: null, activeAct: 0, sound: true };',
        'const defaultState = { completed: [], evidence: [], questions: [], inventory: [], invScrollIndex: 0, lastSave: null, activeAct: 0, sound: true };'
    )
    
    with open(js, "w") as f:
        f.write(js_content)

print("Duplicates removed")
