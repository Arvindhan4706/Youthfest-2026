import fitz  # PyMuPDF
import os

pdf_path = r"d:\Class 12\Youthfest 2026\yuvenzadoc.pdf"
output_dir = r"d:\Class 12\Youthfest 2026\public\memories"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

doc = fitz.open(pdf_path)
image_count = 0

for page_index in range(len(doc)):
    page = doc.load_page(page_index)
    image_list = page.get_images(full=True)
    
    if image_list:
        print(f"[+] Found {len(image_list)} images on page {page_index + 1}")
    else:
        print(f"[!] No images found on page {page_index + 1}")
        
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        image_name = f"pdf_img_page{page_index+1}_{image_index}.{image_ext}"
        image_path = os.path.join(output_dir, image_name)
        
        with open(image_path, "wb") as f:
            f.write(image_bytes)
            
        print(f"[-] Saved {image_path}")
        image_count += 1

print(f"\nTotal extracted images: {image_count}")
