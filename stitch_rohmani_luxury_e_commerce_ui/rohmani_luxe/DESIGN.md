---
name: Rohmani Luxe
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#49463f'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#7b776e'
  outline-variant: '#cbc6bc'
  surface-tint: '#615e57'
  primary: '#615e57'
  on-primary: '#ffffff'
  primary-container: '#f5efe6'
  on-primary-container: '#706c65'
  inverse-primary: '#cbc6bd'
  secondary: '#695b5b'
  on-secondary: '#ffffff'
  secondary-container: '#eedbdb'
  on-secondary-container: '#6d5f5f'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffeec6'
  on-tertiary-container: '#846900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7e2d9'
  primary-fixed-dim: '#cbc6bd'
  on-primary-fixed: '#1d1b16'
  on-primary-fixed-variant: '#494640'
  secondary-fixed: '#f1dede'
  secondary-fixed-dim: '#d5c2c2'
  on-secondary-fixed: '#231919'
  on-secondary-fixed-variant: '#504444'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-edge: 64px
  section-gap: 120px
  element-gap: 16px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 32px
---

## Brand & Style

The brand identity centers on "Quiet Luxury"—a blend of traditional Pakistani heritage and contemporary high-fashion minimalism. The design system is engineered to evoke feelings of serenity, exclusivity, and impeccable craft. It targets a discerning clientele that values tactile quality and understated elegance over loud branding.

The visual style follows a **Minimalist Luxury** movement. It prioritizes vast negative space to allow high-resolution fashion photography to breathe. Elements are delicate, utilizing ultra-thin lines and a soft, tonal color palette to create a high-end editorial feel similar to a luxury lookbook.

## Colors

The palette is a sophisticated curation of warm neutrals and soft pastels. 
- **Primary (Cream/Ecru):** Acts as the foundation, providing a warmer, more premium alternative to pure white.
- **Secondary (Blush Pink):** Used sparingly for hover states, category highlights, and subtle UI backgrounds to inject femininity.
- **Tertiary (Refined Gold):** Applied strictly to interactive accents, icons, and thin borders to signify premium quality.
- **Neutral (Charcoal/Deep Grey):** Used for typography to maintain readability while avoiding the harshness of true black.

## Typography

This design system utilizes a high-contrast typographic pairing. **Noto Serif** (substituting for Playfair Display) serves as the editorial voice, used for large headlines and evocative product titles. It brings a classic, literary authority to the brand.

**Plus Jakarta Sans** (substituting for Poppins) provides a clean, geometric counterpoint for body copy and UI labels. It ensures legibility across mobile and desktop interfaces. A heavy emphasis is placed on `label-caps` for navigation and small headers to maintain an organized, boutique structure.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model on desktop (12 columns) and a fluid model on mobile. A defining characteristic of this design system is the intentional use of "over-spacing"—larger-than-standard margins and section gaps to reinforce the luxury aesthetic. 

Content should never feel crowded. High-fashion imagery often breaks the grid or utilizes asymmetrical placement to mimic the layout of a premium print magazine. Spacing follows a 4px/8px base rhythm, but vertical gaps between major sections are intentionally stretched to create a sense of calm during the scrolling experience.

## Elevation & Depth

Hierarchy is established through **Low-contrast outlines** and **Tonal layering** rather than heavy shadows.
- **Surface Tiers:** The main background is a soft Cream (`#FCF9F6`), while elevated surfaces like product cards or modals use pure White (`#FFFFFF`).
- **Subtle Shadows:** When depth is required (e.g., for floating carts or navigation bars), use "Ambient Shadows"—extremely diffused, low-opacity (4-6%) blurs with a slight warm tint to match the beige palette.
- **Borders:** Ultra-thin (0.5pt to 1pt) borders in Muted Gold or light Beige are used to define boundaries without adding visual noise.

## Shapes

The shape language is "Soft-Modern." Elements use a subtle 0.25rem (4px) corner radius to take the edge off sharp corners without appearing too casual or bubbly. This maintains a structured, architectural feel suitable for high-end textiles while ensuring the UI feels approachable.

- **Buttons:** Rectangular with a 4px soft radius or completely sharp for a more "Couture" look.
- **Input Fields:** Soft edges with thin 1px borders.
- **Imagery:** Maintains sharp 0px corners to emphasize the "editorial frame" look.

## Components

### Buttons
Primary buttons are solid Neutral (Charcoal) or Gold with white text. Secondary buttons are "Ghost" style—thin 1px Gold borders with `label-caps` typography. Hover states involve a subtle background color shift to Blush Pink or a slight enlargement of the gold border.

### Input Fields
Minimalist underline or thin-bordered boxes. Labels should be small and uppercase (`label-caps`). Error states use a muted terracotta rather than a bright red to stay within the pastel harmony.

### Cards
Product cards are borderless with ample padding. The focus is entirely on the image. Price and title appear in centered Noto Serif typography below the image. A "Quick Add" button appears only on hover to maintain visual cleanliness.

### Navigation
The navigation bar is transparent or solid Cream with a thin bottom border in Gold. Use a centered logo with balanced menu items on either side.

### Featured Components
- **Lookbook Slider:** A full-width component for high-resolution fashion films or campaign imagery.
- **Fabric Detail Zoom:** A specialized component for showing the intricate embroidery and texture of the textiles.
- **Collection Filters:** Slide-out drawer or a clean horizontal bar using "Chip" style selectors with soft blush backgrounds.