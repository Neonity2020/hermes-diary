---
name: Astro Blog (Hermes日记 Style)
description: Scaffold a personal blog using Astro 4 + Mizu-inspired design system. Dark-light theme with purple accent, island layout, scroll animations, blur navbar, Inter font, RSS support, and mobile-responsive hamburger menu.
---

# Astro Blog — Hermes日记 Style

Build a beautiful, fast personal blog with the Mizu design system (adapted from muzzle). Pure Astro + Vanilla CSS, no framework dependencies.

## 1. Prerequisites & Compatibility

- **Node.js**: v20.x (Astro 4 for compatibility)
- **npm**: v10+
- **Framework**: Astro 4 (`astro@^4`)
- **Integrations**: `@astrojs/mdx@^3`, `@astrojs/rss@^3`

> ⚠️ Astro 5 requires Node 18+, but some APIs may differ. Stick with Astro 4 for Node v20.10.0 stability.

## 2. Project Scaffold

### package.json

```json
{
  "name": "<project-name>",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/mdx": "^3",
    "@astrojs/rss": "^3",
    "astro": "^4"
  }
}
```

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://<your-site>.netlify.app',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
  },
});
```

### File Structure

```
<project>/
├── astro.config.mjs
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── env.d.ts
│   ├── content/
│   │   ├── config.ts          # Blog collection definition
│   │   └── blog/              # Markdown/MDX posts
│   │       └── example-post.md
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML shell, navbar, footer, scripts
│   │   └── BlogPost.astro     # Article layout with island card
│   ├── pages/
│   │   ├── index.astro        # Homepage: hero + recent posts
│   │   ├── about.astro        # About page
│   │   ├── blog/
│   │   │   ├── index.astro    # All posts list
│   │   │   └── [...slug].astro # Dynamic post renderer
│   │   └── rss.xml.js         # RSS feed
│   └── styles/
│       └── global.css         # Full Mizu design system
```

## 3. Design System (Mizu-inspired)

### Core Aesthetic

- **Island layout**: White floating cards (`border-radius: 40px`) on a diagonal stripe textured background
- **Purple accent**: `#7c5cfc` with glow effects
- **Inter font**: Google Fonts CDN, weights 300-900
- **Blur navbar**: `backdrop-filter: blur(16px)` with scroll darkening
- **Subtle borders**: `rgba(0,0,0,0.07-0.08)` everywhere
- **Multi-layer shadows**: `0 2px 8px + 0 12px 40px + 0 32px 80px`

### CSS Variables (Design Tokens)

```css
:root {
  --primary: #7c5cfc;
  --primary-light: #9b82fc;
  --primary-pale: #f0ecff;
  --primary-glow: rgba(124, 92, 252, 0.25);
  --black: #0F0F0F;
  --gray-900: #1A1A1A;
  --gray-700: #404040;
  --gray-500: #6B6B6B;
  --gray-300: #C0C0C0;
  --gray-100: #F5F5F5;
  --white: #FFFFFF;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 40px;
}
```

### Background Texture (Diagonal Stripes)

```css
body {
  background-color: #EBEBEB;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent, transparent 5px,
    rgba(0, 0, 0, 0.055) 5px,
    rgba(0, 0, 0, 0.055) 6px
  );
}
```

### Island Card

```css
.island {
  background: var(--white);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow:
    0 2px 8px rgba(0,0,0,0.06),
    0 12px 40px rgba(0,0,0,0.07),
    0 32px 80px rgba(0,0,0,0.05);
  padding: 64px 56px;
}
```

### Card Hover

```css
.post-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}
```

## 4. Scroll Animations (IntersectionObserver)

All animated elements use `data-animate` attribute. The observer is in `BaseLayout.astro`:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

CSS:
```css
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms);
}
[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}
```

Stagger cards with `style="--delay: ${i * 80}ms"`.

## 5. Component Patterns

### Navbar (fixed, blur, mobile hamburger)

- Fixed top, `z-index: 100`
- `backdrop-filter: blur(16px)` + transparent bg
- Adds `.scrolled` class on scroll > 20px
- Mobile: three-line burger animates to X, reveals slide-down menu
- Hide nav-links on `max-width: 900px`, show burger

### Hero Section

- Lives inside an `.island` card
- Two animated gradient orbs (blur circles) for visual depth
- Large title with accent color span
- CTA buttons: `.btn--primary` + `.btn--ghost`

### Post Cards

- White cards with `border: 1px solid rgba(0,0,0,0.08)`
- Hover: `translateY(-3px)` + `shadow-lg`
- Tag badge: small pill with `--primary-pale` bg

### Blog Post Layout

- Wrapped in `.island` card
- Back link at top
- Header with title + meta (date)
- Content area with typography styles for h2/h3/blockquote/code/pre/table

### Footer

- Solid black background (`#0F0F0F`)
- Low-contrast white text
- Flexbox layout, centers on mobile

## 6. Content Collections

### config.ts

```typescript
import { defineCollection } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

const blog = defineCollection({
  type: 'content',
  schema: rssSchema,
});

export const collections = { blog };
```

### Blog Post Frontmatter

```markdown
---
title: 'Post Title'
description: 'Short description for card preview and SEO'
pubDate: 2026-04-12
heroImage: ''
tags: ['标签1', '标签2']
---
```

## 7. Dynamic Routes ([...slug].astro)

```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}
const post = Astro.props;
const { Content } = await post.render();
---

<BlogPost title={post.data.title} description={post.data.description} pubDate={post.data.pubDate}>
  <Content />
</BlogPost>
```

## 8. RSS Feed (rss.xml.js)

```javascript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: '<Blog Name>',
    description: '<Blog Description>',
    site: context.site,
    items: posts.sort((a, b) => b.data.pubDate - a.data.pubDate).map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

## 9. Execution Steps

When instructed to build a blog using this skill:

1. Create project directory and `package.json`
2. Run `npm install`
3. Create `astro.config.mjs`, `src/env.d.ts`, `public/favicon.svg`
4. Create `src/content/config.ts` for blog collection
5. Create `src/styles/global.css` with full Mizu design system (see reference file)
6. Create `src/layouts/BaseLayout.astro` with navbar, footer, and scripts
7. Create `src/layouts/BlogPost.astro` with island card layout
8. Create page files: `index.astro`, `blog/index.astro`, `blog/[...slug].astro`, `about.astro`, `rss.xml.js`
9. Add sample blog posts in `src/content/blog/`
10. Run `npx astro build` to verify
11. Initialize git, push to GitHub

## 10. Customization Points

| Element | How to Change |
|---------|--------------|
| Accent color | Change `--primary` in global.css |
| Font | Change Google Fonts link in BaseLayout + CSS `font-family` |
| Site name | Edit navbar logo text + footer |
| Code theme | Change `shikiConfig.theme` in astro.config.mjs |
| Post count on homepage | Change `.slice(0, N)` in index.astro |
| Max width | Change `.container` max-width |

## 11. Deployment (Netlify)

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Connect GitHub repo → auto-deploy on push

## 12. Pitfalls

- **Import paths**: Files in `src/pages/` use `../layouts/`, NOT `../../layouts/`
- **`getCollection` must be explicitly imported** from `astro:content` in every file that uses it
- **`rssSchema`** from `@astrojs/rss` — don't import unused types from `astro:content`
- **Node v20.10.0**: Use Astro 4, not Astro 5 (v5 has compatibility issues)
- **sitemap plugin**: May have version conflicts with Astro 4, omit if not needed
- **npm install timing**: Run `npm install` AFTER writing the final `package.json`
- **CSS `opacity: 0` in `[data-animate]`**: Elements are invisible until JS loads — this is intentional for progressive enhancement
