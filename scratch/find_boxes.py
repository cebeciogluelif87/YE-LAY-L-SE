from PIL import Image

img = Image.open("assets/ipucu.png")
rgba = img.convert("RGBA")
width, height = img.size

# Find bounds of non-transparent pixels
min_x, max_x = width, 0
min_y, max_y = height, 0

for y in range(height):
    for x in range(width):
        r, g, b, a = rgba.getpixel((x, y))
        if a > 50:  # non-transparent
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            min_y = min(min_y, y)
            max_y = max(max_y, y)

print(f"Boxes bound: X: {min_x} to {max_x}, Y: {min_y} to {max_y}")
print(f"Width: {max_x - min_x}, Height: {max_y - min_y}")
