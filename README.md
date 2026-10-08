# Ember & Bun — burger shop website

A single-page site for a burger shop. It uses plain HTML, CSS and JavaScript, with no build step and no dependencies.

## What's on the page
- **Burgers ($15 each):** Double Patty, Bacon Burger, Crispy Chicken
- **Fries:** a thick-cut / thin-cut toggle that swaps the fries in the carton
- **Milkshakes:** Banana Vanilla, Chocolate Banana and Chocolate, with a flavour picker that changes the shake
- **Pop:** Coke, Sprite and Classic Pop
- **Reviews**, **dine-in seating**, **hours** and **location**

## Animations
Preloader, a hero burger that stacks itself layer by layer, a burger that comes apart into labelled layers as you scroll, a scrolling marquee, 3D tilt cards, magnetic buttons, a custom cursor, count-up stats, review carousels, rising embers and more. Visitors who turn on "reduce motion" get a calm version.

## Artwork
All illustrations (burgers, fries, shakes, cups) are drawn in code as SVG in `js/art.js`, so they stay sharp at any size and no image files are needed.

## Run it locally
Because it uses JavaScript modules, serve the folder rather than opening the file directly:

```
npx http-server .   # or: python3 -m http.server
```

## Things to customise
- Shop name, address and hours: `index.html` (hours also in `HOURS` in `js/main.js`)
- Fries ($5), shake ($7) and pop ($3) prices are placeholders: edit them in `index.html`
- The reviews are sample text: replace them with your real customer reviews
