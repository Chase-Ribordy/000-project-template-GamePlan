# Project Assets

**What goes here**: All project files - images, fonts, icons, data files, media.

## Organization

```
assets/
├── images/           # Images (PNG, JPG, SVG, WebP)
├── fonts/            # Custom fonts
├── icons/            # Icon sets
├── data/             # JSON, CSV, config files
├── media/            # Video, audio
└── README.md         # This file
```

## Usage

Reference assets in your code:
```html
<img src="assets/images/logo.png" alt="Logo">
```

```css
@font-face {
  font-family: 'CustomFont';
  src: url('../assets/fonts/custom.woff2');
}
```

```javascript
fetch('assets/data/config.json')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Tips

1. **Optimize images** before adding (compress, resize)
2. **Use web formats** (WebP for images, WOFF2 for fonts)
3. **Organize by type** (images/, fonts/, etc.)
4. **Name clearly** (`hero-background.webp`, not `img1.webp`)
5. **Add to git** (these are part of your project)

## Git LFS (Optional)

For large files (>5MB), consider Git LFS:
```bash
git lfs track "assets/**/*.mp4"
git lfs track "assets/**/*.pdf"
```

---

**This is where you put your project's files.** Agents don't touch this folder.
