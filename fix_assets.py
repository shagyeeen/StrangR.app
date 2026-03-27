import shutil
import os

root = r"c:\Users\Shagin\Desktop\.codeX\StrangR.app"
public_images = os.path.join(root, "public", "images")

if not os.path.exists(public_images):
    os.makedirs(public_images)

# Files to copy
assets = [
    (r"C:\Users\Shagin\.gemini\antigravity\brain\96afd101-94fd-4ef3-a71c-c3e864e8c13f\chat_wallpaper_1774582843727.png", "chat-wallpaper.png"),
    (os.path.join(root, "stitch", "stitch", "logo.png", "screen.png"), "logo.png")
]

for src, dst_name in assets:
    dst = os.path.join(public_images, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {src} to {dst}")
    else:
        print(f"Source not found: {src}")
