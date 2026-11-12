# Ponivraa — Farm-Fresh Fruit & Honey Delivery Platform
**Cultivated & Harvested in Alagarkovil, Tamil Nadu**

A modern, responsive, full-stack e-commerce web application for **Ponivraa**, delivering naturally grown, chemical-free farm mangoes, pure raw hill honey variants, and native guavas directly from farmers in South Tamil Nadu to households across Tamil Nadu and India.

---

## Brand & Farm Information
- **Brand Name:** Ponivraa
- **Farm Location:** Alagarkovil, Tamil Nadu
- **Heritage:** Backed by 25+ years of traditional farming wisdom and Gen Z innovation
- **Promise:** Carbide-Free, Naturally Tree-Ripened, Direct-to-Consumer (D2C)
- **WhatsApp Support & Orders:** `+91 80982 02289`
- **Official Email:** `ponivraa@gmail.com`
- **Google Maps Location:** [View Alagarkovil Farm on Google Maps](https://maps.google.com/?q=Alagarkovil,+Tamil+Nadu)

---

## Tech Stack
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Lucide React (strictly emoji-free UI with smooth section scroll)
- **Backend:** Node.js, Express.js (ES Modules), Multer, Cloudinary SDK
- **Database:** MongoDB Atlas (Mongoose ODM) with resilient built-in zero-config in-memory fallback for immediate offline preview
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS password hashing
- **WhatsApp Integration:** Pre-filled automated WhatsApp ordering to `+91 80982 02289`

---

## Product Categories & Varieties

The platform strictly features **3 harvest categories**:

### 1. Mango
- Alagarkovil Premium Alphonso Mango
- South Farm Banganapalli Mango
- Imam Pasand Royal Mango
- Kallaamai / Kizhimooku Mango
- *Sold by:* Per KG

### 2. Honey
Featuring 4 distinct raw honey varieties with 4 selectable weight variants:
- **Varieties:**
  - Pure Gulkand Honey (sun-cooked Damask rose petals in raw forest honey)
  - Sun-Drenched Fig Honey (organic Anjeer steeped in wild mountain honey)
  - Nutritious Dry Fruits Honey (roasted almonds, cashews, walnuts, pistachios)
  - Alagar Pristine Hill Honey (raw multi-floral forest nectar)
- **Weight Variants & Separate Pricing:**
  - `250 g`
  - `350 g`
  - `500 g`
  - `1 kg`
- Full stock tracking for each weight variant.

### 3. Guava
- Alagarkovil Country White Guava (Koyya)
- Organic Pink Taiwan Guava
- *Sold by:* Per KG

---

## Navigation & Smooth Scroll Architecture

- **Navbar Links:** *Home* (`#home`), *About* (`#about`), *Products* (`#products`), *Track Order* (`#track`), *Contact* (`#contact`).
- Every section is equipped with `scroll-mt-28` so sticky navigation never covers headings or triggers wrong scroll offsets.
- Active navbar link is highlighted dynamically as the user scrolls.
- Clicking any link smoothly scrolls to the exact top of that section from any position on desktop, tablet, or mobile.
- Mobile drawer automatically closes upon selecting a destination.
- Global `<ScrollToTop />` handler ensures route transitions reset view position without footer jumps.

---

## Form Validation Rules

### Checkout Form (`/cart`)
- **Phone Number:** Required Indian 10-digit mobile number starting strictly with 6, 7, 8, or 9 (`/^[6-9]\d{9}$/`). Rejects letters, symbols, and spaces.
- **Email ID:** Required valid email address format.
- **Address:** Required, minimum 10 characters, split into:
  - House / Street Address
  - City
  - State (Tamil Nadu)
  - Pincode: Required valid 6-digit Indian postal code (`/^[1-9]\d{5}$/`).
- **Special Note / Delivery Note:** Dedicated optional field for customer delivery instructions.
- **Place Order Button:** Stays disabled until every field passes validation.

### Contact Form (`/contact` & `#contact`)
- Name, 10-digit mobile number (starting with 6-9), valid email, and minimum 10-character message.
- Validated with inline feedback; submit button remains disabled until valid.

---

## WhatsApp Order Template

Upon placing an order, WhatsApp automatically opens with the exact required format:

```text
🛍️ *NEW ORDER PLACED - PONIVRAA FARM*

📌 *Order ID:* #ORD-1779165060577

👤 *Customer Details:*
- Name: Varsha test
- Phone: 9345468234
- Address: Madurai, 625002

📦 *Items Ordered:*
▫️ *Kallaamai / Kizhimooku* (x3 KG) - ₹297
▫️ *Pure Gulkand Honey* (x1 500 g) - ₹450

💰 *Total Amount:* ₹747
🚚 *Delivery:* FREE across Tamil Nadu
✅ *Status:* PENDING

---
_I am sending this for order confirmation and will attach my payment screenshot below._
```

---

## Localhost Run Commands

Both the backend and frontend are currently running in the background:
- **Frontend Website:** [http://localhost:5173](http://localhost:5173)
- **Admin Management Portal:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

To run from your terminal:
```bash
# In the root folder:
npm run dev
```

### Admin Login Credentials
- **Email:** `admin@ponivraa.com`
- **Password:** `admin123`
*(Includes a one-click "Autofill Credentials" button on `/admin/login`).*
