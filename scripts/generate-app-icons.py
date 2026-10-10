import os
import sys
from PIL import Image, ImageDraw

SOURCE_IMAGE_PATH = r"C:\Users\Mownika Kanagaraj\.gemini\antigravity-ide\brain\14bce5e1-2488-403b-a8a4-2f1dda92da4d\.user_uploaded\media_1791359255700.png"
WORKSPACE_DIR = r"c:\Users\Mownika Kanagaraj\OneDrive\Desktop\Cinmax-Dev"
MOBILE_DIR = os.path.join(WORKSPACE_DIR, "apps", "mobile")
RES_DIR = os.path.join(MOBILE_DIR, "android", "app", "src", "main", "res")
ASSETS_DIR = os.path.join(MOBILE_DIR, "assets")

os.makedirs(ASSETS_DIR, exist_ok=True)

# 1. Load source image and crop tightly to non-transparent logo
src = Image.open(SOURCE_IMAGE_PATH).convert("RGBA")
bbox = src.getbbox()
print("Logo Bounding Box:", bbox) # (140, 375, 592, 654)

logo = src.crop(bbox)
print("Cropped logo size:", logo.size)

# Also save standalone cropped logo PNG for public/assets
logo.save(os.path.join(ASSETS_DIR, "logo.png"), "PNG")
print("Saved assets/logo.png")

# Also copy to website and admin public folders if they exist
for web_dir in [os.path.join(WORKSPACE_DIR, "apps", "website", "public"), os.path.join(WORKSPACE_DIR, "apps", "admin", "public")]:
    os.makedirs(web_dir, exist_ok=True)
    logo.save(os.path.join(web_dir, "logo.png"), "PNG")

def make_square_icon(size, bg_color=(255, 255, 255, 255), padding_ratio=0.12):
    """Creates a crisp square icon with logo centered and padded."""
    icon = Image.new("RGBA", (size, size), bg_color)
    max_logo_w = int(size * (1 - 2 * padding_ratio))
    max_logo_h = int(size * (1 - 2 * padding_ratio))
    
    # Scale logo maintaining aspect ratio
    logo_aspect = logo.width / logo.height
    if logo_aspect > (max_logo_w / max_logo_h):
        new_w = max_logo_w
        new_h = int(new_w / logo_aspect)
    else:
        new_h = max_logo_h
        new_w = int(new_h * logo_aspect)
        
    resized_logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    pos_x = (size - new_w) // 2
    pos_y = (size - new_h) // 2
    icon.paste(resized_logo, (pos_x, pos_y), resized_logo)
    return icon

def make_round_icon(size, bg_color=(255, 255, 255, 255), padding_ratio=0.16):
    """Creates a circular icon with antialiased mask."""
    supersample = 4
    large_size = size * supersample
    large_icon = make_square_icon(large_size, bg_color=bg_color, padding_ratio=padding_ratio)
    
    mask = Image.new("L", (large_size, large_size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, large_size - 1, large_size - 1), fill=255)
    
    large_icon.putalpha(mask)
    round_icon = large_icon.resize((size, size), Image.Resampling.LANCZOS)
    return round_icon

def make_splash_logo(width, height=None):
    """Creates a transparent background splash logo maintaining aspect ratio."""
    logo_aspect = logo.width / logo.height
    if height is None:
        target_w = width
        target_h = int(target_w / logo_aspect)
    else:
        target_h = height
        target_w = int(target_h * logo_aspect)
    return logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Save Master 1024x1024 Expo Assets
master_icon = make_square_icon(1024, padding_ratio=0.10)
master_icon.save(os.path.join(ASSETS_DIR, "icon.png"), "PNG")
print("Saved assets/icon.png (1024x1024)")

adaptive_icon = make_square_icon(1024, padding_ratio=0.20)
adaptive_icon.save(os.path.join(ASSETS_DIR, "adaptive-icon.png"), "PNG")
print("Saved assets/adaptive-icon.png (1024x1024)")

favicon = make_square_icon(192, padding_ratio=0.10)
favicon.save(os.path.join(ASSETS_DIR, "favicon.png"), "PNG")
print("Saved assets/favicon.png (192x192)")

# Splash Master
splash = Image.new("RGBA", (1284, 2778), (255, 255, 255, 255))
splash_logo_img = make_splash_logo(720)
s_x = (splash.width - splash_logo_img.width) // 2
s_y = (splash.height - splash_logo_img.height) // 2
splash.paste(splash_logo_img, (s_x, s_y), splash_logo_img)
splash.save(os.path.join(ASSETS_DIR, "splash.png"), "PNG")
print("Saved assets/splash.png (1284x2778)")

# Android Mipmap Densities for ic_launcher & ic_launcher_round
DENSITIES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

for folder_name, px_size in DENSITIES.items():
    target_dir = os.path.join(RES_DIR, folder_name)
    os.makedirs(target_dir, exist_ok=True)
    
    sq = make_square_icon(px_size, padding_ratio=0.08)
    rd = make_round_icon(px_size, padding_ratio=0.14)
    
    # Save as webp & png for full compatibility
    sq.save(os.path.join(target_dir, "ic_launcher.webp"), "WEBP", quality=100)
    sq.save(os.path.join(target_dir, "ic_launcher.png"), "PNG")
    rd.save(os.path.join(target_dir, "ic_launcher_round.webp"), "WEBP", quality=100)
    rd.save(os.path.join(target_dir, "ic_launcher_round.png"), "PNG")
    print(f"Saved {folder_name} launcher icons ({px_size}x{px_size})")

# Android Drawable Densities for splashscreen_logo.png
DRAWABLE_DENSITIES = {
    "drawable-mdpi": 160,
    "drawable-hdpi": 240,
    "drawable-xhdpi": 320,
    "drawable-xxhdpi": 480,
    "drawable-xxxhdpi": 640,
}

for folder_name, px_size in DRAWABLE_DENSITIES.items():
    target_dir = os.path.join(RES_DIR, folder_name)
    os.makedirs(target_dir, exist_ok=True)
    
    sp_logo = make_splash_logo(px_size)
    sp_logo.save(os.path.join(target_dir, "splashscreen_logo.png"), "PNG")
    print(f"Saved {folder_name}/splashscreen_logo.png ({px_size}px width)")

print("ALL APP ICONS AND SPLASH ASSETS SUCCESSFULLY REGENERATED WITH OFFICIAL CINMAX LOGO!")
