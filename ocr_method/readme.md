# To run the latest version

Navigate to backend/

run `pip install -r requirements.py`

run `uvicorn main:app --reload`

In a new terminal,

Come to ocr_method/

run `open frontend.html`

# Secure Content Delivery Strategy – FastAPI + OCR Defense

##  Strategy Implemented

###  FastAPI Backend (Client-Side Decryption Phase)

```python
# Endpoint: /api/encrypted-content
@app.get("/api/encrypted-content", response_model=EncryptedContentResponse)
async def get_encrypted_content():
    if not PRE_ENCRYPTED_DATA:
        raise HTTPException(status_code=500, detail="Encrypted content not available.")
    return EncryptedContentResponse(encryptedData=PRE_ENCRYPTED_DATA)

# Endpoint: /api/decryption-key
@app.get("/api/decryption-key", response_model=DecryptionKeyResponse)
async def get_decryption_key():
    print("WARNING: Serving decryption key directly. This is insecure and for prototype purposes ONLY.")
    return DecryptionKeyResponse(key=VERY_SECRET_KEY_STRING)
```

### Frontend (Client-Side Decryption)

```javascript
// Fetch encrypted data and key
const encRes = await fetch("/api/encrypted-content").then(res => res.json());
const keyRes = await fetch("/api/decryption-key").then(res => res.json());

const rawData = atob(encRes.encryptedData);
const keyWA = CryptoJS.enc.Utf8.parse(atob(keyRes.key));
const ivWA = CryptoJS.lib.WordArray.create(rawData.substr(8, 16));
const ciphertextWA = CryptoJS.lib.WordArray.create(rawData.substr(24));

const decrypted = CryptoJS.AES.decrypt(
  { ciphertext: ciphertextWA },
  keyWA,
  { iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
);

const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
document.getElementById("canvas").innerText = plaintext;
```

** Outcome:** Successfully solved previous CryptoJS decryption issues by using an explicit decryption method.

---

## Phase 6: Hardening Against AI Scrapers

### Vulnerability Identified

Client-side decryption allowed attackers to:

* Reverse-engineer JavaScript
* Automate key & data fetch
* Decrypt content outside the browser

---

## Strategy Implemented (Server-Side Image Rendering with OCR Poisoning)

### FastAPI Backend

```python
# Endpoint: /api/get-secure-content-view-token
@app.get("/api/get-secure-content-view-token")
async def get_token():
    token = generate_token()
    store_token(token)
    return {"token": token}

# Endpoint: /viewer/content-image/{view_token}
@app.get("/viewer/content-image/{view_token}")
async def serve_image(view_token: str):
    if not validate_and_invalidate_token(view_token):
        raise HTTPException(status_code=403, detail="Invalid or expired token.")

    img = render_text_to_image(ORIGINAL_TEXT)
    poisoned_img = apply_ocr_poisoning(img)

    buf = io.BytesIO()
    poisoned_img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
```

### Frontend

```html
<script>
  async function loadImage() {
    const tokenRes = await fetch("/api/get-secure-content-view-token").then(res => res.json());
    const img = document.getElementById("secureImage");
    img.src = "/viewer/content-image/" + tokenRes.token;
  }
  window.onload = loadImage;
</script>
<img id="secureImage" alt="Secure Content" />
```

---

##  One-Time View Token System for Secure Image Access

### 1. Purpose

To protect server resources and make automated scraping of content images more difficult, a one-time, time-limited view token system is implemented.

#### Goals:

* **Prevent Replay Attacks**
* **Control Access** to image generation
* **Mitigate Abuse** by bots
* **Add Friction** to automated scraping

### 2. Workflow

**Step 1: Requesting a View Token**

```json
GET /api/get-secure-content-view-token
{
  "viewToken": "a_unique_hex_string_token"
}
```

**Step 2: Fetching the Content Image**

```http
GET /viewer/content-image/{view_token}
```

* Validates and invalidates the token
* Expires after a short period (e.g., 1 minute)
* One-time use
* Generates and returns the OCR-poisoned PNG image

### 3. Key Characteristics

* **One-Time Use**
* **Time-Limited** (e.g., 1 min lifetime)
* **Server-Side State** to track token validity

### 4. Benefits for Anti-Scraping

* Scrapers must implement a two-step flow
* Prevents brute-force image sampling
* Reduces risk of server overload
* Supports additional anti-bot defenses (rate limiting, CAPTCHA)

---

##  Why This Works

*  No key or client-side decryption logic is exposed
*  Scrapers receive only a **poisoned image**, not decryptable data
*  Breaking the OCR defenses requires high-effort image processing
