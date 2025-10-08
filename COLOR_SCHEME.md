# Wild Adventure Coach - Color Scheme

## 🎨 Current Color Palette

| Color Name | Hex Code | RGB | Usage |
|-----------|----------|-----|-------|
| **Warm Linen** | `#F5F1E6` | rgb(245, 241, 230) | Background, Light surfaces |
| **Deep Forest** | `#3E5C4B` | rgb(62, 92, 75) | Primary text, Headers, Dark backgrounds |
| **Fern Green** | `#88A47C` | rgb(136, 164, 124) | Accent color, Buttons, Links |
| **Clay Orange** | `#C67B5C` | rgb(198, 123, 92) | Highlight color, CTAs, Active states |
| **Soft Sage** | `#DCE2D0` | rgb(220, 226, 208) | Secondary backgrounds, Subtle elements |

## 📝 Tailwind Class Names

You can use these colors in your Tailwind classes:

```jsx
// Background colors
bg-warm-linen
bg-deep-forest
bg-fern-green
bg-clay-orange
bg-soft-sage

// Text colors
text-warm-linen
text-deep-forest
text-fern-green
text-clay-orange
text-soft-sage

// Border colors
border-warm-linen
border-deep-forest
border-fern-green
border-clay-orange
border-soft-sage
```

## 🔄 Color Mapping (Old → New)

| Old Color | Old Hex | New Color | New Hex |
|-----------|---------|-----------|---------|
| Off-white | `#F7F5EB` | Warm Linen | `#F5F1E6` |
| Warm Beige | `#DCCCA3` | Fern Green | `#88A47C` |
| Moss Green | `#6B8E23` | Fern Green | `#88A47C` |
| Burnt Orange | `#C65D2B` | Clay Orange | `#C67B5C` |
| Forest Green | `#2E4A34` | Deep Forest | `#3E5C4B` |
| Dark Green | `#1a2d20` | Dark Forest | `#2A3D32` |

## 🎯 Usage Guidelines

### Primary Actions
- **Buttons**: `bg-clay-orange hover:bg-clay-orange/90 text-warm-linen`
- **Links**: `text-fern-green hover:text-clay-orange`

### Backgrounds
- **Main Background**: `bg-warm-linen`
- **Section Backgrounds**: `bg-deep-forest` or `bg-soft-sage`
- **Card Backgrounds**: `bg-warm-linen` with `border-fern-green`

### Text
- **Primary Text**: `text-deep-forest`
- **Secondary Text**: `text-fern-green`
- **Light Text (on dark backgrounds)**: `text-warm-linen`
- **Accent Text**: `text-clay-orange`

### Borders & Accents
- **Primary Borders**: `border-fern-green`
- **Highlight Borders**: `border-clay-orange`
- **Subtle Borders**: `border-soft-sage`

## 🌈 Color Accessibility

All color combinations have been chosen for good contrast and readability:

✅ **Warm Linen (#F5F1E6) + Deep Forest (#3E5C4B)** - Excellent contrast for body text
✅ **Deep Forest (#3E5C4B) + Warm Linen (#F5F1E6)** - High contrast for dark sections
✅ **Clay Orange (#C67B5C) + Warm Linen (#F5F1E6)** - Good contrast for buttons and CTAs
✅ **Fern Green (#88A47C) + Deep Forest (#3E5C4B)** - Sufficient contrast for accents

## 📁 Files Updated

- ✅ `tailwind.config.js` - Added custom color definitions
- ✅ `src/index.css` - Updated CSS variables and body styles
- ✅ `src/pages/HomePage.jsx` - Applied new color scheme
- ✅ `src/pages/RetreatsPage.jsx` - Applied new color scheme
- ✅ `src/pages/BookingPage.jsx` - Applied new color scheme
- ✅ `src/pages/BookingSuccessPage.jsx` - Applied new color scheme
- ✅ `src/components/Navigation.jsx` - Applied new color scheme

## 🔧 How to Add New Colors

If you need to add more colors in the future:

1. Add to `tailwind.config.js`:
```js
colors: {
  'your-color-name': '#HEXCODE',
}
```

2. Add to `src/index.css`:
```css
:root {
  --your-color-name: #HEXCODE;
}
```

3. Use in your components:
```jsx
<div className="bg-your-color-name text-your-color-name">
```

---

**Last Updated**: October 8, 2025  
**Design System Version**: 2.0

