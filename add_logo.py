import fitz
import sys

def add_logo(pdf_path, image_path, output_path):
    doc = fitz.open(pdf_path)
    page = doc[0]  # first page
    
    # Search for "MiCassa Logo"
    text_instances = page.search_for("MiCassa Logo")
    
    if text_instances:
        # text bounding box
        rect = text_instances[0]
        x0, y0 = rect.x0, rect.y0
        # Draw white rectangle over the text to erase it
        page.draw_rect(rect, color=(1,1,1), fill=(1,1,1), overlay=True)
    else:
        x0, y0 = 50, 50
        
    # Get image dimensions
    try:
        img = fitz.Pixmap(image_path)
        width, height = img.w, img.h
    except Exception as e:
        print(f"Could not load image: {e}")
        # fallback dimensions
        width, height = 200, 100
        
    # scale the logo (e.g. width 150 pt)
    target_width = 180
    target_height = int(target_width * height / width) if width > 0 else 80
    
    # Move it slightly up if y0 is too low, but y0 from "MiCassa Logo" is probably fine.
    # We might want to center it vertically around y0, but top-left alignment is safe.
    # Often, text bounding box y0 is the ascender. 
    # Let's adjust so it looks nice.
    y0_adj = max(0, y0 - (target_height / 4))
    
    new_rect = fitz.Rect(x0, y0_adj, x0 + target_width, y0_adj + target_height)
    
    # insert image
    page.insert_image(new_rect, filename=image_path)
    
    doc.save(output_path)
    print(f"Saved modified PDF to {output_path}")

if __name__ == "__main__":
    add_logo(sys.argv[1], sys.argv[2], sys.argv[3])
