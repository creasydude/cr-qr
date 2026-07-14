<div align="center">

# QR Code Generator

A stylish, feature-rich QR code generator built with Next.js, Tailwind CSS, and shadcn/ui.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/creasydude/cr-qr)

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-f48120?logo=cloudflare)

![Screenshot](public/screenshot.png)

</div>

---

## Features

- **Multiple QR types** — URL, Text, or WiFi network credentials
- **WiFi QR codes** — Generate scannable WiFi codes with SSID, password, encryption type, and hidden network support
- **5 style presets** — Clean, Classic, Soft, Bold, and Elegant dot/corner styles via `qr-code-styling`
- **Logo overlay** — Add a logo or icon to the center of your QR code
- **Custom colors** — Foreground and background color pickers with presets
- **Error correction levels** — L, M, Q, H (with tooltip explanation)
- **Export as SVG or PNG** — Download your QR code in either format
- **Animated background** — Subtle floating particle animation

## Credits

Originally crafted by [Kas Ferreira](https://github.com/minikas). Tweaked by [creasydude](https://github.com/creasydude).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/creasydude/cr-qr.git
cd cr-qr

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Cloudflare Pages

This project uses the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) for deployment to Cloudflare Pages.

### Option 1: One-Click Deploy

Click the **Deploy to Cloudflare** button at the top of this README.

### Option 2: Manual Deploy via CLI

1. **Install Wrangler CLI** (if you haven't already):

   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**:

   ```bash
   npx wrangler login
   ```

3. **Build for Cloudflare**:

   ```bash
   npm run pages:build
   ```

4. **Preview locally** (optional):

   ```bash
   npm run preview
   ```

5. **Deploy**:

   ```bash
   npm run deploy
   ```

   First-time deploy will create a new Pages project. Subsequent deploys update it.

### Option 3: GitHub Actions (Auto-Deploy)

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
2. Click **Create a project** → **Connect to Git**
3. Select your GitHub repository
4. Set build configuration:
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.open-next/assets`
5. Click **Save and Deploy**

Every push to `main` will trigger an automatic deployment.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (new-york style) |
| QR Rendering | [qr-code-styling](https://github.com/nicepkg/qr-code-styling) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com/) via [OpenNext](https://opennext.js.org/cloudflare) |

## License

[MIT](LICENSE)
