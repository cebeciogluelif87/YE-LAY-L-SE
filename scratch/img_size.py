from PIL import Image

def get_size(image_path):
    img = Image.open(image_path)
    return img.size

print("ipucu.png size:", get_size("assets/ipucu.png"))
print("ust.png size:", get_size("assets/ust.png"))
print("alt.png size:", get_size("assets/alt.png"))
