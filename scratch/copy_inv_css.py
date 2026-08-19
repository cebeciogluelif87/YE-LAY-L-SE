with open("styles.css", "r") as f:
    content = f.read()

# Extract the block starting from "/* Görsel Envanter Sistemi */"
start_idx = content.find("/* Görsel Envanter Sistemi */")
if start_idx != -1:
    css_block = content[start_idx:]
    
    with open("1/styles.css", "a") as f:
        f.write("\n\n" + css_block)
        
    with open("2/styles.css", "a") as f:
        f.write("\n\n" + css_block)
        
    print("CSS copied to 1/styles.css and 2/styles.css")
else:
    print("Block not found!")
