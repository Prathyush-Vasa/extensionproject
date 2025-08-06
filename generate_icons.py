#!/usr/bin/env python3
"""
Generate icon files for the Workday Work History Auto-Fill extension
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Pillow not installed. Installing...")
    import subprocess
    subprocess.check_call(["pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont
    import os

def create_icon(size, filename):
    """Create an icon with the specified size"""
    # Create a new image with blue background
    img = Image.new('RGB', (size, size), color='#007bff')
    draw = ImageDraw.Draw(img)
    
    # Add border
    border_width = max(1, size // 32)
    draw.rectangle([0, 0, size-1, size-1], outline='#0056b3', width=border_width)
    
    # Add "W" text
    try:
        # Try to use a system font
        font_size = int(size * 0.6)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), "W", font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    # Draw the text
    draw.text((x, y), "W", fill='white', font=font)
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    """Generate all required icon files"""
    # Create icons directory if it doesn't exist
    icons_dir = "icons"
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
        print(f"Created {icons_dir} directory")
    
    # Generate icons
    icon_sizes = [
        (16, "icons/icon16.png"),
        (48, "icons/icon48.png"),
        (128, "icons/icon128.png")
    ]
    
    for size, filename in icon_sizes:
        create_icon(size, filename)
    
    print("\nAll icons generated successfully!")
    print("You can now load the extension in Chrome/Edge.")

if __name__ == "__main__":
    main() 