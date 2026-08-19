from PIL import Image

def get_bbox(image_path):
    img = Image.open(image_path)
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    return bbox

print("ust.png bbox:", get_bbox("assets/ust.png"))
print("alt.png bbox:", get_bbox("assets/alt.png"))
print("ipucu.png bbox:", get_bbox("assets/ipucu.png"))
