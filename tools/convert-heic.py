#!/usr/bin/env python3
"""
Convert HEIC files to JPG using pillow-heif
Install: pip install pillow pillow-heif
"""
import os
import sys
from pathlib import Path

try:
    from pillow_heif import register_heif_opener
    from PIL import Image
    register_heif_opener()
except ImportError:
    print("Error: pillow-heif not installed")
    print("Install with: pip install pillow pillow-heif")
    sys.exit(1)

def convert_heic_to_jpg(input_path, output_path):
    try:
        img = Image.open(input_path)
        img.convert('RGB').save(output_path, 'JPEG', quality=90)
        size_kb = os.path.getsize(output_path) / 1024
        print(f"✓ {os.path.basename(output_path)} created ({size_kb:.1f}KB)")
        return True
    except Exception as e:
        print(f"✗ Error converting {input_path}: {e}")
        return False

def main():
    script_dir = Path(__file__).parent
    august_dir = script_dir.parent / 'public' / 'images' / 'august retreat'
    
    if not august_dir.exists():
        print(f"Error: Directory not found: {august_dir}")
        return
    
    heic_files = list(august_dir.glob('*.HEIC')) + list(august_dir.glob('*.heic'))
    
    if not heic_files:
        print("No HEIC files found to convert.")
        return
    
    print(f"Found {len(heic_files)} HEIC file(s) to convert:\n")
    
    converted = 0
    for heic_file in heic_files:
        jpg_file = heic_file.with_suffix('.jpg')
        
        if jpg_file.exists():
            print(f"⏭️  Skipping {heic_file.name} - {jpg_file.name} already exists")
            continue
        
        if convert_heic_to_jpg(heic_file, jpg_file):
            converted += 1
    
    print(f"\n✓ Conversion complete! Converted {converted} file(s).")

if __name__ == '__main__':
    main()

