from PIL import Image

def get_bbox(image_path):
    img = Image.open(image_path)
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    return bbox

print("ileri.png bbox:", get_bbox("assets/ileri.png"))
print("geri.png bbox:", get_bbox("assets/geri.png"))
