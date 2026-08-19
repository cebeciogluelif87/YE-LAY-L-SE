from PIL import Image
import numpy as np

img = Image.open("assets/ipucu.png")
alpha = np.array(img.split()[-1])
# Crop to the bbox
alpha = alpha[95:985, 1743:1881]
# Find horizontal lines where alpha > 0
row_sums = np.sum(alpha, axis=1)
# Print the non-zero segments
segments = []
start = None
for i, val in enumerate(row_sums):
    if val > 0 and start is None:
        start = i
    elif val == 0 and start is not None:
        segments.append((start, i))
        start = None
if start is not None:
    segments.append((start, len(row_sums)))

for i, seg in enumerate(segments):
    print(f"Slot {i}: {seg[0]+95} to {seg[1]+95}, height: {seg[1]-seg[0]}")
