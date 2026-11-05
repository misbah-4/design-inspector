# Decisions log
Keeps track of why the product is the way it is, for the case study later.

## 2026-11-05 — MVP build
- **Chrome only (Manifest V3).** Also covers Edge, Arc and Brave. Firefox later.
- **Detailed inspector = floating panel**, not the side panel. The side panel shrinks the viewport, which is the DevTools problem we're solving. The panel is draggable and resizable, and it opens on the side of the screen away from the selected element.
- **Full MVP scope:** hover highlight, click-to-lock, quick tooltip, detailed panel with box-model preview, typography, colors, copy-on-click, and parent/child/sibling navigation.
- **No build step (plain JS).** Load-unpacked works right away and stays cheap to iterate on. Move to Vite and TypeScript if it grows.
- **Minimal permissions (`activeTab` + `scripting`).** Runs only on the tab where you click the icon, and the install shows no scary "read all sites" warning.
- **UI isolated in a Shadow DOM** so site CSS can't break it and it can't break the site.
- **Real CSS vs measured values:** Gap shows the CSS `gap` when one exists. Otherwise it measures spacing between children and labels it "measured". `space-between` shows as "Auto (~Xpx)".
- **Background = color you actually see.** Walks up to the first painted ancestor and labels it "from parent".
- **Never show stale numbers:** if the selected element leaves the page, values are cleared and an "Element unavailable" state appears.
- **Fixed from the mockups:** width and height were swapped, the tooltip background showed the text color, and values are now rounded to 2 decimals.
- **Dropped for now:** the "misbahbox.world" footer.

## 2026-11-05 — Settings gear
- **The gear in the Inspect pill opens a settings popover**, as the user asked.
- **Settings:** color format (HEX/RGB/HSL), units (px/rem, where rem is based on the site's root font size), decimal places (0/1/2), and switches for the margin and child overlays. They're saved with `chrome.storage.sync`, so they persist and follow your Chrome profile. This added the `storage` permission, which shows no install warning.
- **rem always keeps at least 2 decimals.** Testing showed rem at 0 decimals turns `3.55rem` into `4` and small gaps into `0rem`. The Decimals setting still applies fully to px.
- The popover closes on Esc, on clicking outside it, or on clicking the gear again. The keyboard shortcut is shown but can only be changed in Chrome's own shortcuts page.
