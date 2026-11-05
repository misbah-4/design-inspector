# Design Inspector (Chrome extension, MVP)

Inspect any website's design visually: size, spacing, colors and typography, without DevTools.

## Install (2 minutes)
1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and pick this `design-inspector` folder
4. Pin the extension (puzzle icon → pin)

After editing files, click the reload ↻ icon on the extension card, then refresh the page.

## Use
| Action | How |
|---|---|
| Turn on / off | Click the toolbar icon or press **Alt+Shift+I** |
| Quick inspect | Hover any element |
| Lock selection | Click |
| Move around | ↑ parent · ↓ first child · ← → siblings |
| Detailed view | **Details** button or **Enter** |
| Copy a value | Click it |
| Back out | **Esc** (closes panel → releases lock → turns off) |

Overlay colors: green = padding, orange = margin, purple hatch = gap/free space, blue = children.

## Known limits
- Doesn't run on `chrome://` pages or the Chrome Web Store (Chrome blocks this).
- Content inside cross-origin iframes can't be inspected; the panel says so.
- Closed shadow DOM can't be entered. Open shadow DOM works.
