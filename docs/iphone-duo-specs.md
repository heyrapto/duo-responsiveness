# iPhone Duo — Official Specifications

> Source: Apple Store product page. Last updated: September 2026.

---

## Displays

The iPhone Duo features two separate OLED displays: an **inner** (main) display exposed when the device is unfolded, and an **outer** (cover) display used while folded.

### Inner Display

| Property | Value |
|---|---|
| Type | Super Retina XDR display |
| Technology | All-screen OLED folding display |
| Diagonal | **7.6 inches** |
| Physical resolution | **1878 × 2670 px** |
| Pixel density | **430 ppi** |
| Finish | Nano-texture |
| OLEDs | Wide-angle OLEDs |
| Orientation (open) | Landscape |

### Outer / Cover Display

| Property | Value |
|---|---|
| Type | Super Retina XDR display |
| Technology | All-screen OLED display |
| Diagonal | **5.4 inches** |
| Physical resolution | **1398 × 2034 px** |
| Pixel density | **460 ppi** |
| Orientation (closed) | Portrait |

---

## Developer Reference — CSS Viewport Dimensions

These are the simulated viewport sizes a website "sees" inside each display, derived from the physical pixel resolution at the standard **3× Retina scale factor**.

| Mode | Display | Physical px | Scale | **CSS viewport** |
|---|---|---|---|---|
| Single (closed) | Outer / Cover | 1398 × 2034 | 3× | **466 × 678 px** (portrait) |
| Extended (open) | Inner / Main | 1878 × 2670 | 3× | **890 × 626 px** (landscape) |

> **Note:** When the device is open (Extended mode), the physical portrait dimensions rotate to landscape — the 2670-pixel axis becomes the width (890 CSS px) and the 1878-pixel axis becomes the height (626 CSS px).

---

## External Buttons and Connectors

Diagram reference: device shown in **landscape / extended-open orientation**.

### Top Edge (landscape)
| Position | Component |
|---|---|
| Left | Built-in stereo speaker, Built-in microphone |
| Right | Volume up / Volume down buttons |

### Right Edge (landscape)
| Position | Component |
|---|---|
| Upper | Side button (power / Face ID) |
| Lower | Camera Control |

### Bottom — Left Panel Edge
| Position | Component |
|---|---|
| Left | Built-in microphones |
| Centre | USB-C connector |
| Right | Built-in stereo speaker |

### Bottom — Right Panel Edge
| Position | Component |
|---|---|
| Left | Built-in stereo speaker |
| Right | Volume up / Volume down |

---

## Physical Form Factor

| Property | Detail |
|---|---|
| Form | Vertical fold (book-style), folds left-to-right |
| Hinge | Central vertical fold; visible crease at x = 445 CSS px in extended mode |
| Inner display | Uninterrupted — no Dynamic Island |
| Outer display | Dynamic Island at top-centre |
| Connector | USB-C |

---

## Device Dimensions Used in Simulator

These are the simulated outer shell measurements used in `lib/devices.ts`.

### Single Mode (portrait shell)
```
Total width:  10 (bezel) + 466 (screen) + 10 (bezel) = 486 px
Total height: 54 (top bezel) + 678 (screen) + 30 (bottom bezel) = 762 px
```

### Extended Mode (landscape shell)
```
Total width:  10 (bezel) + 890 (screen) + 10 (bezel) = 910 px
Total height: 22 (top bezel) + 626 (screen) + 22 (bottom bezel) = 670 px
Hinge crease: at x = 445 px within screen area (890 ÷ 2)
```
