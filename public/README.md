# public/ - Deployable Build Output

This folder contains **bundled, optimized assets** ready for deployment to production.

## Purpose

The `public/` folder is the final build output containing:
- Minified and bundled CSS
- Minified and bundled JavaScript
- Optimized HTML files
- Compressed images and assets
- Static files ready for CDN/web server

## Build Process

Components are built from `src/` to `public/`:

```bash
# Future: Build script
npm run build
```

### Build Pipeline

1. **Source**: Components in `src/`
2. **Processing**:
   - CSS: Concatenate, minify, autoprefixer
   - JS: Bundle, minify, tree-shake
   - HTML: Template injection, minification
   - Assets: Image optimization, compression
3. **Output**: Optimized files in `public/`

## Folder Structure

```
public/
├── index.html          # Main application entry
├── css/
│   └── bundle.min.css  # Bundled and minified CSS
├── js/
│   └── bundle.min.js   # Bundled and minified JS
├── assets/
│   ├── images/         # Optimized images
│   ├── fonts/          # Web fonts
│   └── icons/          # Icon assets
└── manifest.json       # PWA manifest (optional)
```

## Deployment

### Local Testing

```bash
# Serve public/ folder locally
npx serve public
```

### Production Deployment

```bash
# Deploy to your hosting service
# Examples:
netlify deploy --dir=public
vercel --prod
aws s3 sync public/ s3://your-bucket/
```

## Git Ignore

The `public/` folder is **git-ignored** by default since it's generated build output. Only commit if you need to deploy via GitHub Pages or similar.

## Cache Busting

Build process should add content hashes to filenames:
- `bundle.abc123.min.css`
- `bundle.xyz789.min.js`

This ensures browsers don't cache old versions.

## Best Practices

1. **Never edit files in public/ directly** - Always edit source files in `src/`
2. **Clean before build** - Remove old build artifacts: `rm -rf public/* && npm run build`
3. **Test production build** - Always test the built output before deploying
4. **Monitor bundle size** - Keep bundles under reasonable size limits
5. **Enable compression** - Use gzip/brotli compression on your web server
