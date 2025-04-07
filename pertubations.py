
import random

# Add invisible characters (e.g., zero-width space) that will not affect visual rendering
def add_invisible_chars(text):
    invisible_chars = ["\u200B", "\u200C", "\u200D", "\u2060"]  # Zero-width space, non-joiner, joiner, invisible separator
    perturbed_text = ""
    for char in text:
        perturbed_text += char  # Add the normal character
        if random.random() < 0.15:  # 15% chance to insert an invisible character
            perturbed_text += random.choice(invisible_chars)  # Add invisible char between letters
    return perturbed_text

# Insert right-to-left override characters to confuse copy-pasting more aggressively
def add_directional_override(text):
    directional_chars = ["\u202D", "\u202E"]  # Left-to-right override, Right-to-left override
    perturbed_text = ""
    for char in text:
        perturbed_text += char  # Add the normal character
        
        # Insert directional override characters at higher frequency to really confuse copying
        if random.random() < 0.25:  # 25% chance to insert a directional control
            perturbed_text += random.choice(directional_chars)  # Insert a directional override
        
        # To add more drastic effects, insert both LTR and RTL overrides in sequence
        if random.random() < 0.15:  # 15% chance to add both LTR and RTL together
            perturbed_text += "\u202D"  # Left-to-right override
            perturbed_text += "\u202E"  # Right-to-left override

    return perturbed_text

# Add invisible characters and directional overrides to the text
def perturb_text(text):
    text = add_invisible_chars(text)
    text = add_directional_override(text)
    return text

# Example usage
original_text = "This is a sample text to demonstrate pertubations"
perturbed_text = perturb_text(original_text)

print("Original:", original_text)
print("Perturbed:", perturbed_text)
