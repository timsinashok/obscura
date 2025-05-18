# main_server_image.py (with more aggressive OCR poisoning)
import secrets
import io
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import Response 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import uvicorn
import random
import os
import math
import numpy as np # For more advanced distortions

# --- Configuration & Global State ---
ORIGINAL_TEXT_CONTENT = '''This is valuable writer's content. We aim to make it difficult for AI scrapers to train on this
data by using advanced OCR-resistant image rendering techniques. Human readability is key, but OCR failure is paramount.'''
active_view_tokens = {}
VIEW_TOKEN_LIFETIME_MINUTES = 1

# --- OCR Poisoning Configuration ---
# --- MORE AGGRESSIVE PERTURBATION SETTINGS ---
PERTURBATION_LEVEL = "medium" # 'mild', 'medium', 'strong', 'extreme'

# IMPORTANT: You MUST provide paths to .ttf or .otf font files.
# These are examples; find fonts that are hard for OCR.
# Cursive, condensed, gothic, very stylized, or slightly irregular fonts.
# Using a list allows for random selection.
POTENTIAL_FONTS = [
    "fonts/Cantarell-Regular.ttf", # Standard, but as a fallback if others fail
    "fonts/SomeCursiveFont.ttf",    # e.g., "LearningCurvePro.ttf" "Mistral.ttf"
    "fonts/SomeCondensedDistortedFont.ttf", # e.g., "Impacted.ttf" (if very condensed)
    "fonts/SomeGothicFont.ttf",   # e.g., "OldEnglishTextMT.ttf"
    "fonts/SomeSlightlyIrregularSans.ttf", # e.g., a font with inconsistent kerning/weights
    
]
# Filter out fonts that don't exist for the current run
AVAILABLE_FONTS = [f for f in POTENTIAL_FONTS if os.path.exists(f)]
if not AVAILABLE_FONTS:
    print("WARNING: No custom fonts found in the POTENTIAL_FONTS list. OCR resistance will be lower.")
    # Add more robust default font loading if all custom fonts fail
    AVAILABLE_FONTS.append("Arial.ttf") # Basic fallback, assuming it can be found by PIL

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


# --- Helper: Mesh Transform for Warping ---
def create_mesh_transform(image_size, amplitude=10, frequency=0.05, phase_x=0, phase_y=0):
    """Creates a mesh for Image.transform to apply a wave warp."""
    width, height = image_size
    mesh = []
    for y in range(height + 1): # Need height+1 points for height segments
        row = []
        for x in range(width + 1): # Need width+1 points for width segments
            dx = amplitude * math.sin(frequency * y + phase_x)
            dy = amplitude * math.sin(frequency * x + phase_y)
            row.append((x + dx, y + dy))
        mesh.append(tuple(row))
    
    # The mesh structure for Image.transform is a list of (target_box, quad_mesh) tuples.
    # For a full image warp, target_box is (0, 0, width, height)
    # and quad_mesh is a flattened list of (x,y) for the corners of each source quad.
    # Simpler: Image.transform with MESH type expects a list of (box, mesh_quad) tuples
    # For a single mesh over the whole image:
    # The 'mesh' here needs to be converted to the format Pillow expects for Image.transform with MESH
    # which is a list of (target_rectangle, source_quadrilateral_vertices)
    # For simplicity, a full image distortion with Image.transform using just a matrix or a more direct warp
    # might be easier than generating a complex mesh.
    # Let's use a simpler approach for warping individual lines or characters if possible,
    # or apply a general image filter that distorts.
    # For now, this function is a placeholder for more advanced warping concepts.
    # The current wave effect is applied per-character during drawing.
    return None # Placeholder, will use per-char wave instead for now

# --- Image Generation & Perturbation Function (Heavily Modified) ---
def create_text_image_with_stronger_kaptcha_techniques(text_content: str) -> bytes:
    # --- Font Setup ---
    if not AVAILABLE_FONTS:
        chosen_font_path = "arial.ttf" # Absolute fallback, PIL might find it
    else:
        chosen_font_path = random.choice(AVAILABLE_FONTS)

    font_size_config = {
        'mild': random.randint(24, 28),
        'medium': random.randint(22, 26),
        'strong': random.randint(20, 24),
        'extreme': random.randint(18, 22) # Smaller fonts can be harder with distortions
    }
    font_size = font_size_config[PERTURBATION_LEVEL]
    
    font = None
    try:
        font = ImageFont.truetype(chosen_font_path, font_size)
        print(f"Using font: {chosen_font_path} at size {font_size}")
    except IOError:
        print(f"Warning: Font '{chosen_font_path}' failed. Using default PIL font at size {font_size}.")
        try: font = ImageFont.load_default(size=font_size)
        except TypeError: font = ImageFont.load_default()


    # --- Text Preparation & Image Sizing ---
    lines = text_content.split('\n')
    temp_draw = ImageDraw.Draw(Image.new('RGB', (1,1)))
    max_line_width = 0
    total_text_block_height = 0
    line_heights = []
    
    # Line spacing can be negative for overlap in strong/extreme
    line_spacing_config = {'mild': 5, 'medium': 3, 'strong': 0, 'extreme': -2}
    line_spacing = line_spacing_config[PERTURBATION_LEVEL]

    for line in lines:
        try: bbox = temp_draw.textbbox((0,0), line, font=font); lw = bbox[2] - bbox[0]; lh = bbox[3] - bbox[1];
        except AttributeError: size = temp_draw.textsize(line, font=font); lw = size[0]; lh = size[1];
        if lw > max_line_width: max_line_width = lw
        line_heights.append(lh)
        total_text_block_height += lh + line_spacing
    total_text_block_height = max(0, total_text_block_height - line_spacing) 

    padding_config = {'mild': 40, 'medium': 30, 'strong': 25, 'extreme': 20}
    padding = padding_config[PERTURBATION_LEVEL]
    img_width = int(max_line_width + 2 * padding)
    img_height = int(total_text_block_height + 2 * padding)
    
    # --- Image Canvas Creation ---
    # More varied background
    bg_r = random.randint(200, 250)
    bg_g = random.randint(200, 250)
    bg_b = random.randint(200, 250)
    image_bg_color = (bg_r, bg_g, bg_b)
    image = Image.new('RGB', (img_width, img_height), color=image_bg_color)
    draw = ImageDraw.Draw(image)

    # --- Perturbations ---

    # 1. Advanced Background Noise/Texture
    noise_density_config = {'mild': 0.02, 'medium': 0.05, 'strong': 0.08, 'extreme': 0.12}
    if PERTURBATION_LEVEL != "mild":
        for _ in range(int(img_width * img_height * noise_density_config[PERTURBATION_LEVEL])):
            x, y = random.randint(0, img_width - 1), random.randint(0, img_height - 1)
            # Noise color can be darker or lighter than BG
            noise_offset = random.randint(-30, 30) 
            n_r = max(0, min(255, bg_r + noise_offset + random.randint(-5,5)))
            n_g = max(0, min(255, bg_g + noise_offset + random.randint(-5,5)))
            n_b = max(0, min(255, bg_b + noise_offset + random.randint(-5,5)))
            draw.point((x, y), fill=(n_r, n_g, n_b))
        # Add some random lines to background texture
        for _ in range(random.randint(5,15)):
            lx1, ly1 = random.randint(0,img_width), random.randint(0,img_height)
            lx2, ly2 = random.randint(0,img_width), random.randint(0,img_height)
            loffset = random.randint(-20,20)
            lcol = max(0,min(255, bg_r+loffset))
            draw.line([(lx1,ly1),(lx2,ly2)], fill=(lcol,lcol,lcol), width=1)


    # 2. More Aggressive Wave Distortion (per line, or per character)
    amp_conf = {'mild': (0,1), 'medium': (1,2.5), 'strong': (2,4), 'extreme': (3,5)}
    freq_conf = {'mild': (0.01,0.02), 'medium': (0.02,0.05), 'strong': (0.04,0.08), 'extreme': (0.05,0.1)}
    
    wave_amplitude_y = random.uniform(*amp_conf[PERTURBATION_LEVEL])
    wave_frequency_x = random.uniform(*freq_conf[PERTURBATION_LEVEL])
    wave_amplitude_x = random.uniform(0, wave_amplitude_y * 0.5) # Horizontal wave too
    wave_frequency_y = random.uniform(0, wave_frequency_x * 0.5)
    
    # 3. Character Crowding, Overlap, and Vertical Jitter
    spacing_conf = {'mild': 0, 'medium': -1.0, 'strong': -1.5, 'extreme': -2.5} # More negative for overlap
    char_spacing_factor = spacing_conf[PERTURBATION_LEVEL]
    v_jitter_conf = {'mild': 0.5, 'medium': 1.0, 'strong': 1.5, 'extreme': 2.0}
    vertical_char_jitter_max = v_jitter_conf[PERTURBATION_LEVEL]

    # 4. Occluding Elements (Thicker, more varied)
    occlusion_conf = {'mild': 0, 'medium': (2,1), 'strong': (4,2), 'extreme': (6,3)} # (count, max_thickness)
    if PERTURBATION_LEVEL != "mild":
        occlusion_count, max_thickness = occlusion_conf[PERTURBATION_LEVEL]
        for _ in range(occlusion_count):
            x1, y1 = random.randint(0, img_width), random.randint(0, img_height)
            x2, y2 = random.randint(0, img_width), random.randint(0, img_height)
            # Colors can be closer to text, or contrasting, or multi-colored
            line_color = (random.randint(50,200), random.randint(50,200), random.randint(50,200))
            thickness = random.randint(1, max_thickness)
            if random.random() < 0.3: # Draw some arcs too
                angle_start = random.randint(0,360)
                angle_end = angle_start + random.randint(30,120)
                bbox_size = random.randint(20, min(img_width,img_height)//3)
                arc_x1 = random.randint(0,img_width-bbox_size)
                arc_y1 = random.randint(0,img_height-bbox_size)
                draw.arc([arc_x1, arc_y1, arc_x1+bbox_size, arc_y1+bbox_size], angle_start, angle_end, fill=line_color, width=thickness)
            else:
                draw.line([(x1, y1), (x2, y2)], fill=line_color, width=thickness)
            
    # --- Text Drawing ---
    current_y = padding
    # Text color can also be slightly variable or closer to BG for some levels
    base_text_color_val = random.randint(10, 60) if PERTURBATION_LEVEL != 'extreme' else random.randint(60,120)

    for i, line in enumerate(lines):
        # Line-level slight rotation
        angle_degrees = random.uniform(-2.5, 2.5) if PERTURBATION_LEVEL in ["strong", "extreme"] else random.uniform(-1,1)
        
        # Create a temporary transparent image for this line
        try: bbox = draw.textbbox((0,0), line, font=font); line_width_est = bbox[2] - bbox[0]; line_height_est = bbox[3] - bbox[1];
        except AttributeError: size = draw.textsize(line, font=font); line_width_est = size[0]; line_height_est = size[1];

        # Add padding for rotation
        line_img_width = int(line_width_est + abs(line_height_est * math.sin(math.radians(angle_degrees))) + 20)
        line_img_height = int(line_height_est + abs(line_width_est * math.sin(math.radians(angle_degrees))) + 20)
        
        if line_img_width <=0 or line_img_height <=0: # Safety for empty lines or calc issues
            current_y += line_heights[i] + line_spacing
            continue

        line_image = Image.new('RGBA', (line_img_width, line_img_height), (0,0,0,0))
        line_draw = ImageDraw.Draw(line_image)
        
        char_x_pos_on_line_img = 10 # Start drawing char on this temp image

        for char_idx, char_in_line in enumerate(line):
            # Text color variation per character for extreme
            if PERTURBATION_LEVEL == 'extreme':
                char_color_val = max(0,min(255, base_text_color_val + random.randint(-20,20)))
                char_color = (char_color_val,char_color_val,char_color_val)
            else:
                char_color = (base_text_color_val, base_text_color_val, base_text_color_val)

            y_wave = wave_amplitude_y * math.sin(wave_frequency_x * char_x_pos_on_line_img + random.uniform(-math.pi, math.pi))
            x_wave = wave_amplitude_x * math.sin(wave_frequency_y * (10 + y_wave) + random.uniform(-math.pi, math.pi)) # 10 is approx y_pos_on_line_img

            x_jit = random.uniform(-1, 1) if PERTURBATION_LEVEL in ["strong", "extreme"] else random.uniform(-0.5,0.5)
            y_jit = random.uniform(-vertical_char_jitter_max, vertical_char_jitter_max)
            
            line_draw.text((char_x_pos_on_line_img + x_jit + x_wave, 10 + y_jit + y_wave), # 10 is y_pos_on_line_img
                      char_in_line, font=font, fill=char_color)
            
            try: char_bbox = line_draw.textbbox((0,0), char_in_line, font=font); char_actual_width = char_bbox[2]-char_bbox[0];
            except AttributeError: char_size = line_draw.textsize(char_in_line, font=font); char_actual_width = char_size[0];
            
            spacing_jit = random.uniform(-0.5,0.5) if PERTURBATION_LEVEL in ["strong", "extreme"] else 0
            char_x_pos_on_line_img += char_actual_width + char_spacing_factor + spacing_jit

        # Rotate the line image
        rotated_line_image = line_image.rotate(angle_degrees, expand=True, resample=Image.BICUBIC)
        
        # Paste onto main image
        # Calculate paste position to keep lines roughly centered horizontally
        paste_x = int((img_width - rotated_line_image.width) / 2)
        paste_y = int(current_y)
        image.paste(rotated_line_image, (paste_x, paste_y), rotated_line_image) # Use alpha mask

        current_y += line_heights[i] + line_spacing + abs(rotated_line_image.height - line_img_height)/2 # Adjust for rotation expansion


    # 5. Post-processing image filters
    if PERTURBATION_LEVEL == "strong":
        if random.random() < 0.5:
            image = image.filter(ImageFilter.ModeFilter(size=3)) # Can make chars thicker/thinner
        else:
            image = image.filter(ImageFilter.RankFilter(size=3, rank=random.randint(2,6))) # rank near median/4 can be noisy
        if random.random() < 0.3:
            image = image.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.1,0.4)))
    elif PERTURBATION_LEVEL == "extreme":
        image = image.filter(ImageFilter.ModeFilter(size=random.choice([3,5])))
        image = image.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3,0.7)))
        if random.random() < 0.5: # Add salt-and-pepper like noise by pixel manipulation
            pixels = image.load()
            for _ in range(int(img_width * img_height * 0.01)): # 1% of pixels
                px, py = random.randint(0, img_width-1), random.randint(0, img_height-1)
                val = random.choice([0,255])
                pixels[px,py] = (val,val,val)


    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()


# --- Pydantic Models & API Endpoints (remain the same) ---
class ViewTokenResponse(BaseModel):
    viewToken: str

@app.get("/api/get-secure-content-view-token", response_model=ViewTokenResponse)
async def request_secure_content_view_token():
    view_token = secrets.token_hex(16)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=VIEW_TOKEN_LIFETIME_MINUTES)
    active_view_tokens[view_token] = {"expires_at": expires_at}
    print(f"Backend: Generated view token: {view_token}")
    return ViewTokenResponse(viewToken=view_token)

@app.get("/viewer/content-image/{view_token}")
async def get_content_as_image(view_token: str):
    current_time = datetime.now(timezone.utc)
    # Simplified cleanup for brevity
    for token in list(active_view_tokens.keys()): 
        if token in active_view_tokens and active_view_tokens[token]["expires_at"] < current_time:
            del active_view_tokens[token]

    token_data = active_view_tokens.get(view_token)
    if not token_data:
        raise HTTPException(status_code=404, detail="View token not found or already used.")
    if token_data["expires_at"] < current_time: # Check again after potential cleanup
         if view_token in active_view_tokens: del active_view_tokens[view_token]
         raise HTTPException(status_code=403, detail="View token has expired.")

    if view_token in active_view_tokens: del active_view_tokens[view_token]
    print(f"Backend: Serving image for view token {view_token} and invalidating token.")
    
    image_bytes = create_text_image_with_stronger_kaptcha_techniques(ORIGINAL_TEXT_CONTENT)
    return Response(content=image_bytes, media_type="image/png")

@app.get("/")
async def read_root_server_image():
    return {"message": "FastAPI server for (Stronger Kaptcha) server-side image rendering."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)