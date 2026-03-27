import shutil
import os

src = r"C:\Users\Shagin\.gemini\antigravity\brain\96afd101-94fd-4ef3-a71c-c3e864e8c13f\chat_wallpaper_1774582843727.png"
dst = r"c:\Users\Shagin\Desktop\.codeX\StrangR.app\public\images\chat-wallpaper.png"

if os.path.exists(src):
    shutil.copy2(src, dst)
    print(f"Copied {src} to {dst}")
else:
    print(f"Source not found: {src}")
