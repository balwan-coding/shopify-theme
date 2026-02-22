# Lumina Shopify Theme

**Version:** 1.0.0 | **Author:** Lumina Theme | **License:** Proprietary

A premium, performance-optimized Shopify theme with modern animations, dark mode, and a full feature set designed to pass Shopify Theme Store requirements.

---

## 🚀 Features

- **GSAP-powered animations** — hero text reveal, scroll triggers, parallax
- **Dark/Light mode toggle** — persisted in localStorage
- **Animated cart drawer** — Ajax cart with quantity updates
- **Ajax search** — live results via Shopify Predictive Search API
- **Wishlist** — localStorage-based wishlist with count badge
- **Recently viewed** — persisted product history
- **Animated mega menu** — keyboard-accessible, hover-triggered
- **Infinite scroll** — on collection pages
- **Testimonials slider** — auto-play with GSAP
- **Mobile-first responsive** — works on all screen sizes
- **SEO optimized** — Schema.org markup, canonical URLs, meta tags
- **Accessibility** — WCAG 2.1 AA compliant (skip links, ARIA, focus management)
- **Lighthouse 90+** — lazy loading, minimal JS, optimized assets

---

## 📁 Folder Structure

```
lumina-theme/
├── layout/
│   └── theme.liquid           # Root HTML wrapper
├── templates/
│   ├── index.json             # Home page
│   ├── product.json           # Product page
│   ├── collection.json        # Collection page
│   ├── blog.json              # Blog listing
│   ├── article.json           # Blog post
│   ├── page.about.json        # About page
│   ├── page.contact.json      # Contact page
│   └── 404.json               # 404 page
├── sections/
│   ├── header.liquid          # Sticky header with mega menu
│   ├── footer.liquid          # Full footer with payment icons
│   ├── announcement-bar.liquid
│   ├── cart-drawer.liquid     # Animated slide-out cart
│   ├── search-drawer.liquid   # Ajax search overlay
│   ├── hero-banner.liquid     # Animated hero
│   ├── featured-collections.liquid
│   ├── featured-products.liquid
│   ├── testimonials-slider.liquid
│   ├── newsletter-section.liquid
│   ├── main-product.liquid    # Full product page
│   ├── main-collection.liquid # Collection with filters
│   ├── main-blog.liquid
│   ├── main-article.liquid
│   ├── main-about.liquid      # Story + timeline + team
│   ├── main-contact.liquid    # Contact form + map
│   ├── main-404.liquid        # Animated 404
│   ├── related-products.liquid
│   └── recently-viewed.liquid
├── snippets/
│   ├── product-card.liquid    # Reusable product card
│   └── product-card-placeholder.liquid
├── assets/
│   ├── theme.css              # Complete design system (CSS custom properties)
│   └── theme.js               # All JS: cart, search, wishlist, GSAP, etc.
├── config/
│   ├── settings_schema.json   # Theme customizer settings
│   └── settings_data.json     # Default values
└── locales/
    └── en.default.json        # English translations
```

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) 3.x+
- A Shopify Partner account

### Install Shopify CLI

```bash
npm install -g @shopify/cli @shopify/theme
```

### Clone & Connect

```bash
# Connect to your store
shopify auth login --store your-store.myshopify.com

# Navigate to theme folder
cd lumina-theme

# Push to Shopify
shopify theme push

# Or develop locally with hot reload
shopify theme dev
```

### Deploy to Theme Store

```bash
# Package the theme
shopify theme package

# Validate (must pass before submission)
shopify theme check
```

---

## 🎨 Customization

### Theme Customizer

Go to **Online Store → Themes → Customize** to access:

- **Colors** — Primary, Accent, Background, Text
- **Typography** — Body & Heading font pickers, base font size
- **Layout** — Max container width, enable/disable animations
- **Cart** — Drawer vs. page, cart notes
- **Product** — Show vendor, ratings, image zoom
- **Social links** — Instagram, Facebook, X, TikTok, Pinterest, YouTube
- **Checkout** — Logo, accent color

### CSS Custom Properties

Edit `/assets/theme.css` to modify the design system:

```css
:root {
  --color-accent: #c8a96e;     /* Gold accent */
  --color-primary: #0f0f0f;   /* Dark text/buttons */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', sans-serif;
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Dark Mode Colors

```css
[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-text: #f0f0f0;
  /* ... */
}
```

---

## 🧩 Sections Reference

### Hero Banner (`hero-banner`)

| Setting | Type | Description |
|---|---|---|
| `image` | image_picker | Hero background image |
| `video` | video | Background video (overrides image) |
| `title` | textarea | Headline (use new lines for animated lines) |
| `subtitle` | textarea | Subheading text |
| `eyebrow` | text | Small label above headline |
| `cta_primary_text` | text | Primary button label |
| `cta_primary_url` | url | Primary button link |
| `overlay_opacity` | range 0-80 | Overlay darkness |
| `hero_height` | range 50-100vh | Min section height |

### Featured Collections (`featured-collections`)

Add up to 6 collection blocks. Each block:
- Pick a Shopify collection → auto-pulls image & count
- Or override with custom image & title

### Product Card (`snippets/product-card.liquid`)

```liquid
{% render 'product-card', product: product %}
```

Features: hover image swap, quick-add (single variant), wishlist toggle, sale badge, rating stars.

### Cart Drawer (`cart-drawer`)

- Ajax quantity updates (no page reload)
- Animated item entrance/exit
- Discount code input → redirects to `/discount/{code}`
- Free shipping progress bar ready

### Testimonials Slider (`testimonials-slider`)

GSAP-animated. Supports unlimited blocks, each with:
- Star rating (1-5)
- Quote text
- Avatar image
- Author name & role
- Verified badge

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 480px | Single column, simplified nav |
| Tablet | 480–768px | 2-col product grid |
| Laptop | 768–1024px | Full nav hidden → burger |
| Desktop | 1024–1400px | Full layout |
| Wide | > 1400px | Capped at `--container-max` |

---

## 🔧 Advanced JavaScript API

The theme exposes globals for use in custom scripts:

```javascript
// Show a toast notification
window.LuminaToast.show('Item added!', 'success');
window.LuminaToast.show('Error!', 'error');

// Cart API
window.LuminaCart.openDrawer();
window.LuminaCart.closeDrawer();
window.LuminaCart.fetchCart();

// Wishlist
window.LuminaWishlist.toggle(productId);
window.LuminaWishlist.has(productId); // true/false
```

### Custom Events

```javascript
// Fired when variant changes on product page
document.addEventListener('variant:changed', (e) => {
  console.log('New variant:', e.detail.variant);
});
```

---

## 🎬 Animation System

### CSS Classes

```html
<!-- Fade up from below -->
<div class="anim-fade-up">Content</div>

<!-- Fade in -->
<div class="anim-fade-in">Content</div>

<!-- Scale in -->
<div class="anim-scale-in">Content</div>

<!-- Slide from left/right -->
<div class="anim-slide-left">Content</div>
<div class="anim-slide-right">Content</div>

<!-- Stagger children -->
<div data-stagger="0.1">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Delay utilities -->
<div class="anim-fade-up anim-delay-2">Delayed 200ms</div>
```

### GSAP Direct Usage

```javascript
// Available after DOMContentLoaded if GSAP loaded
gsap.from('.my-element', {
  opacity: 0,
  y: 50,
  duration: 0.8,
  scrollTrigger: {
    trigger: '.my-element',
    start: 'top 85%'
  }
});
```

---

## 🔍 SEO Features

- **Schema.org JSON-LD** — Product, BreadcrumbList, BlogPosting
- **Canonical URLs** — via `{{ canonical_url }}`
- **Open Graph tags** — title, description, image (via Shopify's built-in)
- **Structured breadcrumbs** — on collection and article pages
- **Alt text** — enforced on all images
- **Semantic HTML** — `<article>`, `<nav>`, `<main>`, `<aside>`, ARIA landmarks

---

## ♿ Accessibility

- Skip-to-content link
- Keyboard navigation for mega menu, cart drawer, accordions
- ARIA labels on all icon buttons
- ARIA live regions for cart updates and search results
- Focus management when drawers open/close
- `prefers-reduced-motion` media query respected
- Color contrast meets WCAG AA

---

## 🧪 Theme Validation

Run before submitting to Theme Store:

```bash
shopify theme check --category accessibility
shopify theme check --category performance  
shopify theme check --category translation
```

Common fixes:
- All images must have `alt` attributes
- `loading="lazy"` on all non-critical images
- `loading="eager"` and `fetchpriority="high"` on LCP image (hero)
- No inline `<script>` tags with external sources (use CDN defers)

---

## 📦 Third-Party Dependencies

| Library | Version | Purpose | Load Method |
|---|---|---|---|
| GSAP | 3.12.2 | Animations | CDN, deferred |
| ScrollTrigger | 3.12.2 | Scroll animations | CDN, deferred |
| ScrollToPlugin | 3.12.2 | Smooth scroll | CDN, deferred |
| Inter (font) | — | Body font | Google Fonts |
| Playfair Display | — | Heading font | Google Fonts |

No npm build step required — theme uses vanilla CSS and ES6+.

---

## 🛠 Troubleshooting

**Cart not updating:**
- Check browser console for fetch errors
- Verify `routes.cart_url` is correct in `shopData`

**GSAP animations not playing:**
- Ensure CDN scripts load before `theme.js`
- Check for CORS errors in console
- Fallback IntersectionObserver will activate automatically

**Dark mode not persisting:**
- Verify `localStorage` is available (no private browsing restrictions)

**Mega menu not appearing:**
- Requires menu links to have child links in Shopify admin

---

## 📄 License

This theme is proprietary. Do not redistribute without license.

---

## 🆘 Support

- Documentation: https://luminatheme.com/docs
- Email: support@luminatheme.com
- Issues: Include browser, Shopify plan, and screenshot
