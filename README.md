# Thompson Valley Disposal Website

A mobile-first, multi-page static website for Thompson Valley Disposal — a Kamloops BC-based disposal and site services company serving homeowners, contractors, businesses, and acreage owners across the Thompson Valley.

## Overview

The site is built as a fast-loading, SEO-friendly multi-page architecture. Each service has its own dedicated page with unique content focused on Kamloops and the Thompson Valley. The design uses a charcoal and lime-green brand palette, card components, modern typography, and responsive behaviour.

## Project Structure

```
/
├── index.html                    # Home page — primary conversion page
├── about.html                    # About Thompson Valley Disposal
├── retaining-walls.html          # Bin Rentals service page (legacy file name)
├── excavation.html               # Excavation service page
├── landscaping-irrigation.html   # Landscaping & Clean-Up service page (legacy file name)
├── gallery.html                  # Project and equipment gallery
├── contact.html                  # Contact page with form and service areas
├── about.md                      # Source content (legacy fallback)
├── services.md                   # Source content (legacy fallback)
├── contact.md                    # Source content (legacy fallback)
├── projects.md                   # Source content (legacy fallback)
├── testimonials.md               # Source content (legacy fallback)
├── assets/
│   ├── hero-placeholder.jpg      # Hero background placeholder
│   ├── gallery/                  # Project photo placeholders
│   └── logos/                    # Favicon and placeholder files
├── images/                       # Real disposal-company photos
├── css/
│   └── styles.css                # Mobile-first stylesheet
├── js/
│   └── script.js                 # Navigation, gallery, slider, form UX
├── README.md                     # This file
└── generate-placeholders.py      # Script that generated placeholder images
```

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Home / primary conversion page with hero, services overview, featured projects, why choose us, testimonials, and CTA |
| `about.html` | Company story, values, mission, and who we serve |
| `retaining-walls.html` | **Bin Rentals** — mini, small/medium, large, and roll-off bins |
| `excavation.html` | Site preparation, trenching, grading, and earthmoving |
| `landscaping-irrigation.html` | **Landscaping & Clean-Up** — property clean-ups, landscaping, yard waste, firewood |
| `gallery.html` | Filterable masonry gallery of bins, trucks, equipment, and projects |
| `contact.html` | Contact form, phone/email, hours, and service areas |

## How to View Locally

Open any HTML file directly in a browser, or serve the folder with a local HTTP server:

### Option 1: Python

```bash
python -m http.server 8000

# Then open http://localhost:8000
```

### Option 2: Node.js (live-server)

```bash
npx live-server --port=8000
```

### Option 3: VS Code

Install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

## Customization Guide

### 1. Replace Logo & Favicon

The site currently uses the provided raccoon logo at `images/logo.webp`. To update:

- Header logo: `images/logo.webp`
- Footer logo: `images/logo.webp`
- Favicon source: `images/favicon.webp`
- Generated favicons: `assets/logos/favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png`

To regenerate favicons from `images/favicon.webp`, run:

```bash
python generate-favicon.py
```

This requires the Pillow package (installed in the project virtual environment at `.venv`).

### 2. Replace Hero & Page Header Images

Drop high-quality wide photos into `images/` and update the references in each `.html` file:

- `images/semi-truck.webp`
- `images/truck.webp`
- `images/roll-off-bin.webp`
- `images/excavator.webp`
- `images/landscaping.webp`

### 3. Add Project Photos to the Gallery

Drop photos into `images/` and add new `<figure class="gallery-item" data-category="...">...</figure>` blocks to `gallery.html`. The gallery expands 12 items at a time via the **Load More Photos** button.

### 4. Update Text Content

Edit content directly in each HTML file. Each service page has dedicated SEO-focused sections for its topic. Update project captions, service descriptions, testimonials, and contact details as needed.

### 5. Connect the Contact Form

The contact form currently captures input in JavaScript and shows a local confirmation message. Before launch, connect it to a backend:

- **Formspree**: set `<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`
- **Netlify Forms**: add `data-netlify="true"` or `netlify`
- **Custom backend**: point the form `action` to your endpoint

### 6. Update Contact Information

Current contact details are `(250) 320-5865` and `info@tvsl.ca`. Search and replace across all `.html` files if these change.

## Design Notes

- **Colors**: white background, charcoal text (`#1A1A1A`), lime-green accent (`#C8E33D`).
- **Typography**: Inter font stack for fast loading, bold headings for a modern feel.
- **Layout**: mobile-first responsive CSS with breakpoints at 640px, 900px, and 1100px.
- **Navigation**: sticky header with mobile hamburger menu and full cross-page navigation.
- **Breadcrumbs**: semantic breadcrumb navigation on all internal pages with Schema.org markup.
- **CTA Banner**: clear call-to-action section at the bottom of every page.
- **Gallery**: CSS masonry layout (1 column on mobile, 2 on tablet, 3 on desktop) with category filters and lightbox.
- **Performance**: minimal JavaScript, no external dependencies, lazy-loaded gallery images.
- **SEO**: unique titles, meta descriptions, canonical URLs, Open Graph tags, and JSON-LD schema on every page.

## Target Clients

- Homeowners in Kamloops and the Thompson Valley
- Contractors and builders
- Businesses and commercial clients
- Acreage and rural property owners

## Services Highlighted

- Bin Rentals
- Roll-Off Bin Rentals
- Excavation
- Landscaping
- Property Clean-Up
- Firewood Sales
- Recycling
- Asbestos Transportation

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). IE11 is not supported.

## Credits

Built for Thompson Valley Disposal, Kamloops BC.
