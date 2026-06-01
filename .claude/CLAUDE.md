# Project Instructions

## Overview

This project is a static marketplace website for selling personal items such as:
- furniture
- electronics
- appliances
- office items
- toys
- bedding/bath items

The website is intentionally simple:
- no backend
- no database
- no authentication
- no CMS
- no payments

Products are managed through a static JSON file and deployed via Vercel.

---

# Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Static Export (`output: 'export'`)
- Vercel hosting

---

# Architecture Rules

## Static-First

This project MUST remain static-first.

DO:
- use static JSON
- use local assets
- use `/public`
- use static routes
- use client components only when interactivity is needed

DO NOT:
- add databases
- add server actions unnecessarily
- add API routes for local assets
- add authentication
- add CMS complexity
- add infinite scroll
- add backend media loaders

---

# Product Data

Products are stored in:

```txt
/data/products.json
```

# Product Type

```ts
export type ProductStatus =
  | 'available'
  | 'reserved'
  | 'sold';

export type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  images: string[];
  status: ProductStatus;
  availableDate?: string;
  quantity?: number;
  category?:
    | 'informática'
    | 'eletrodomésticos'
    | 'mobilia'
    | 'cama/banho'
    | 'brinquedo'
    | 'outros';
  originalLink?: string;
};
```

---

# Image Strategy

**IMPORTANT**
This project uses static export.

DO NOT:

- create API image loaders
- use filesystem route handlers
- dynamically read local files
- create /api/media
- use dynamic media servers

## Correct Image Architecture

Images MUST live inside:

```txt
/public/products/
```

Recommended structure:

```txt
/public/products/{product-slug}/1.webp
/public/products/{product-slug}/2.webp
```

Example:

```txt
/public/products/macbook-air/1.webp
/public/products/macbook-air/2.webp
```

## Product JSON Example

```json
{
  "slug": "macbook-air",
  "images": [
    "1.webp",
    "2.webp"
  ]
}
```

## Image URL Usage

```ts
const imageUrl = `/products/${product.slug}/${image}`;
```

---

# Image Components

If using next/image, ALWAYS use:

```ts
unoptimized
```

because static export does not support the default optimizer.

---

# UI Guidelines

## Use shadcn/ui whenever possible

Prefer:
- Card
- Button
- Badge
- Input
- Select
- ScrollArea
- Breadcrumb
- Separator

Avoid creating custom primitives unnecessarily.

---

## Product List Behavior

### Sorting Priority

Products MUST always be sorted:

1. available
2. reserved
3. sold

Inside the same status:
- sort by availableDate ascending

---

## Search & Filters

Homepage includes:
- text search
- category filter

Filtering is client-side only.

DO NOT:
- add backend search
- add Algolia
- add Elasticsearch

---

# Product Details

Product detail page MUST include:

- image gallery
- thumbnail list
- magnifier zoom
- title
- description
- price
- status badge
- reserve button
- breadcrumbs
- back button

---

# Reservation Flow

Reservations are handled manually through WhatsApp.
The reserve button opens:

```
https://wa.me/
```

with a prefilled message.
There is NO:

- payment integration
- checkout
- reservation backend

Status updates are manual:

- edit JSON
- push to GitHub
- Vercel redeploys

---

# Performance Guidelines

DO:

- lazy load images
- use WebP
- compress images
- keep bundle small

DO NOT:

- implement infinite scroll
- add virtualization
- overengineer state management
- preload all images

---

# Client Components

Use "use client" ONLY when needed.

Examples:

- search/filter state
- image gallery
- magnifier
- carousel interactions

Everything else should remain Server Components.

---

# Code Style

- Keep components small
- Prefer composition
- Avoid unnecessary abstractions
- Keep business logic simple
- Prioritize readability over cleverness

---

# Deployment

Hosted on Vercel.

Static export configuration:

```ts
output: 'export'
```

---

# Goal

The goal is:

- fast MVP
- clean UI
- easy maintenance
- easy product updates
- lightweight static marketplace

Avoid enterprise complexity.