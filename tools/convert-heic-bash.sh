#!/bin/bash
# Convert HEIC to JPG using ImageMagick (if available)
# Usage: bash tools/convert-heic-bash.sh

cd "$(dirname "$0")/.."
AUGUST_DIR="public/images/august retreat"

if [ ! -d "$AUGUST_DIR" ]; then
    echo "Error: Directory not found: $AUGUST_DIR"
    exit 1
fi

cd "$AUGUST_DIR"

# Check if ImageMagick is available
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
elif command -v convert &> /dev/null; then
    CONVERT_CMD="convert"
else
    echo "Error: ImageMagick not found. Install with: sudo apt-get install imagemagick"
    exit 1
fi

echo "Converting HEIC files to JPG using $CONVERT_CMD..."
echo ""

for heic_file in *.HEIC *.heic; do
    if [ -f "$heic_file" ]; then
        jpg_file="${heic_file%.*}.jpg"
        
        if [ -f "$jpg_file" ]; then
            echo "⏭️  Skipping $heic_file - $jpg_file already exists"
        else
            echo "Converting $heic_file to $jpg_file..."
            $CONVERT_CMD "$heic_file" -quality 90 "$jpg_file"
            if [ $? -eq 0 ]; then
                size=$(du -h "$jpg_file" | cut -f1)
                echo "✓ $jpg_file created ($size)"
            else
                echo "✗ Error converting $heic_file"
            fi
        fi
    fi
done

echo ""
echo "✓ Conversion complete!"

