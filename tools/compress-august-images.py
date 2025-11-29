#!/usr/bin/env python3
"""
Compress JPG images in the August retreat folder
Uses PIL/Pillow which we already have installed
"""
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: PIL/Pillow not installed")
    print("Install with: pip install pillow (in your venv)")
    sys.exit(1)

def compress_image(input_path, output_path, quality=80):
    """Compress a JPG image"""
    try:
        img = Image.open(input_path)
        
        # Convert to RGB if needed (removes alpha channel)
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = rgb_img
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save with compression
        img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
        
        original_size = os.path.getsize(input_path)
        new_size = os.path.getsize(output_path)
        saved = ((original_size - new_size) / original_size * 100)
        saved_mb = (original_size - new_size) / (1024 * 1024)
        
        print(f"✓ {os.path.basename(input_path)}: {original_size / 1024 / 1024:.2f}MB → {new_size / 1024 / 1024:.2f}MB ({saved:.1f}% saved, {saved_mb:.2f}MB)")
        return True, original_size, new_size
    except Exception as e:
        print(f"✗ Error compressing {input_path}: {e}")
        return False, 0, 0

def main():
    script_dir = Path(__file__).parent
    august_dir = script_dir.parent / 'public' / 'images' / 'august retreat'
    
    if not august_dir.exists():
        print(f"Error: Directory not found: {august_dir}")
        return
    
    jpg_files = list(august_dir.glob('*.jpg')) + list(august_dir.glob('*.JPG'))
    
    if not jpg_files:
        print("No JPG files found to compress.")
        return
    
    print(f"Compressing {len(jpg_files)} JPG file(s) in August retreat folder...\n")
    
    total_original = 0
    total_new = 0
    compressed = 0
    
    for jpg_file in sorted(jpg_files):
        temp_file = jpg_file.with_suffix('.jpg.tmp')
        
        success, orig_size, new_size = compress_image(jpg_file, temp_file, quality=80)
        
        if success:
            # Replace original with compressed version
            jpg_file.unlink()
            temp_file.rename(jpg_file)
            total_original += orig_size
            total_new += new_size
            compressed += 1
    
    if compressed > 0:
        total_saved = ((total_original - total_new) / total_original * 100)
        total_saved_mb = (total_original - total_new) / (1024 * 1024)
        
        print(f"\n✓ Compression complete!")
        print(f"  Compressed: {compressed} file(s)")
        print(f"  Total size: {total_original / 1024 / 1024:.2f}MB → {total_new / 1024 / 1024:.2f}MB")
        print(f"  Saved: {total_saved:.1f}% ({total_saved_mb:.2f}MB)")
        print(f"\nImages will now load much faster! 🚀")

if __name__ == '__main__':
    main()

