# Klarlabs Brand Assets

Canonical logo files. Source of truth for the mark used in the site favicon, GitHub org avatar, and anywhere else the brand appears.

| File | Use |
| --- | --- |
| `klarlabs-mark.svg` | Square app-icon mark — teal K on `#09090B`, radius 112/512 |
| `klarlabs-mark-512.png` | Raster export for avatars (GitHub org, social) |
| `klarlabs-logo-light.svg` | Horizontal lockup for light backgrounds (ink `#0a0a0b`) |
| `klarlabs-logo-dark.svg` | Horizontal lockup for dark backgrounds (ink `#fafafa`, accent `#14b8a6`) |

## Rules

- Accent is Klarlabs Teal `#0d9488` (`--kl-accent`); `#14b8a6` (`--kl-accent-light`) on dark ink.
- Wordmark is always lowercase: `klar` in ink + `labs` in accent, semibold — matches the site header (`klar&hairsp;<em>labs</em>`).
- Typeface: DM Sans (`--kl-font-sans`). Lockup SVGs reference it by name; embed or outline the text before using where DM Sans is not loaded.
- The mark's K is drawn, not typeset — stroke `40/512`, round caps. Don't substitute a font glyph.
- Regenerate the PNG from the SVG (headless Chrome renders it correctly; ImageMagick's SVG renderer does not):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --screenshot=klarlabs-mark-512.png --window-size=512,512 \
  --default-background-color=00000000 "file://$PWD/klarlabs-mark.svg"
```
