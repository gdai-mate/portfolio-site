# Website Building Portfolio

Simple, clean portfolio site showcasing website building services.

## Features

- Clean, minimal design with 62° diagonal parallax effect
- Glassmorphism contact form with floating labels
- SendGrid email integration
- Fully responsive
- Accessible (WCAG compliant)
- Smooth animations and transitions

## Setup

1. The site is ready to deploy to GitHub Pages
2. Custom domain setup: Add a `CNAME` file with your domain
3. Configure DNS: Point your domain to GitHub Pages

## Formspree Configuration

The form uses Formspree for secure email delivery. Your form endpoint is already configured in `script.js`:
- Form ID: `mblpgzpk`
- Submissions are sent to: `info@gdaimate.com`
- Free tier: 50 submissions/month with spam filtering

## Local Development

Simply open `index.html` in a browser or use a local server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve
```

## Deployment

This site is configured to deploy via GitHub Pages automatically.

## Custom Domain Setup

To use `gdaimate.com.au`:

1. Add a `CNAME` file to the repository root with: `gdaimate.com.au`
2. In your domain registrar, add these DNS records:
   - Type: `CNAME`
   - Name: `@` (or leave blank for root domain)
   - Value: `gdaimate.github.io`
   - Or use A records pointing to GitHub's IPs if CNAME for root is not supported
3. Enable HTTPS in GitHub Pages settings

GitHub Pages IP addresses (if using A records):
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153
