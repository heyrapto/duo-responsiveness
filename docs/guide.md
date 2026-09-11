I want to build a very simple responsive testing tool using Next.js.

The purpose of the tool is to let a user enter a website URL and preview that website inside an iPhone Duo device frame.

### User flow

Keep the onboarding extremely simple.

1. User lands on the homepage.
2. They see a URL input.
3. They paste a website URL.
4. They click “Test Website”.
5. The app loads the website inside the iPhone Duo frame.

That's the entire primary experience.

### Website preview

The website should be rendered using an iframe inside the device.

The user must be able to interact with the website normally, including:

* Scrolling
* Clicking links
* Opening menus
* Filling inputs
* Navigating between pages
* Using buttons
* Interacting with the website just as they normally would

Do not add developer inspection tools, breakpoint detection, console logs, network monitoring, element inspection, or other developer tooling.

The goal is simply to visually and interactively test the website inside the device.

### iPhone Duo frame

Create a realistic iPhone Duo device frame around the website.

The device should have:

* Two displays
* A physical-looking hinge between the displays
* Rounded corners
* Appropriate bezels
* A clean, polished appearance

Use the correct dimensions and viewport size for the specific iPhone Duo reference/device being simulated. Keep these values in a central device configuration so they can easily be changed later.

### Display modes

Add a simple control that allows the user to switch between:

**Single Display**

The website is displayed inside one screen of the iPhone Duo.

**Extended Display**

The website expands across both displays, with the physical hinge remaining visible in the center.

The same website should remain interactive in both modes.

The user should be able to scroll and navigate the website normally regardless of the selected display mode.

### Scaling

The physical device should automatically scale down to fit the available browser space while preserving the simulated viewport dimensions.

For example, if the simulated screen is 430 × 932 CSS pixels but the user's browser doesn't have enough space to display it at that size, visually scale the entire device down rather than changing the website's simulated viewport.

This is important because the website should still behave as if it is being viewed at the actual device viewport size.

### UI

Keep the interface minimal.

Homepage:

* Product name/logo
* Short description
* URL input
* “Test Website” button

Testing page:

* Small toolbar
* Single Display / Extended Display toggle
* Refresh button
* iPhone Duo preview

Do not add unnecessary settings or dashboards.

### Technical approach

Use:

* Next.js
* TypeScript
* Tailwind CSS
* React
* iframe

Keep the implementation simple and component-based.

Suggested structure:

```text
app/
├── page.tsx
└── test/
    └── page.tsx

components/
├── UrlInput.tsx
├── Simulator.tsx
├── DeviceFrame.tsx
└── DisplayToggle.tsx

lib/
└── devices.ts
```

The device dimensions should live in `devices.ts` rather than being scattered throughout the components.

### Important iframe limitation

Some websites may prevent themselves from being embedded using `X-Frame-Options` or Content Security Policy.

For the MVP, don't build a proxy or browser rendering system.

If a website cannot be embedded, simply show a clear message such as:

“This website doesn't allow embedded previews.”

### Overall goal

The product should feel extremely simple:

**Paste URL → Test Website → Website appears inside iPhone Duo → Scroll and interact → Switch between Single and Extended Display.**

Focus on making the device simulation visually polished and the website interaction feel natural.

Do not add additional developer inspection or debugging features.
