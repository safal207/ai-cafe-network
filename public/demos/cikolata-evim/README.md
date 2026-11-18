# Çikolata Evim digital menu

An independent demonstration for AI Café Network. The production build copies this folder to the `cikolata-evim/` URL on the existing GitHub Pages site.

The source is the supplied [FineDine café menu](https://qr.finedinemenu.com/cikolata-evim-2/menu/69d0222b0dbc4f83db49c74f) and its [chocolate collection](https://qr.finedinemenu.com/cikolata-evim-2/menu/69d022330dbc4f83db49c97e), captured on 2026-11-18. Their displayed price update date is 2026-01-17. The 271 catalog entries retain original Turkish product names and source descriptions. Prices use integer kuruş. Products with missing prices, variable weights or unverified option prices remain visible and link to the source. Confirm availability with the café.

The interface supports Turkish, Russian and English. The mobile navigation opens the menu, pairings, favorites and basket. Each item can be shared directly using a link. The basket and favorites are stored on the device. The customer can choose dine-in or takeaway for the Turkish summary shown to café staff. The site has no payment or order transmission integration. Pair prices are the sum of the two source prices.

The logo is sourced from [Çikolata Evim](https://cikolataevim.com/pages/magazalar). Catalog photography comes from FineDine. Key images are bundled as WebP and remaining source images are lazy loaded from the source image host. Branding and photography belong to their respective owners.

To preview the published folder locally, serve this directory with a static HTTP server, for example `python3 -m http.server 8080`.
