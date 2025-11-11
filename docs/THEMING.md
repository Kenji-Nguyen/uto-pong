# Theming & shadcn/ui Setup Guide

## Overview

Uto Pong uses **shadcn/ui** with **Tailwind CSS v4** for the UI component library and styling system. The design system features a **blue and orange** color scheme that provides a modern, energetic look appropriate for a ping pong tracker.

---

## Color Scheme

### Primary Colors
- **Primary (Blue):** Main interactive elements like buttons, links, and important UI elements
- **Accent (Orange):** Highlights, badges, notifications, and secondary call-to-actions
- **Destructive (Red):** Error states and destructive actions
- **Secondary (Light Blue/Gray):** Subtle backgrounds and secondary elements

### Color Philosophy
The blue/orange combination was chosen to:
- Create visual energy and excitement (orange)
- Maintain professional appearance (blue)
- Ensure excellent contrast and accessibility
- Differentiate player rankings and stats visually

---

## Technical Implementation

### File Structure
```
uto-pong/
├── components.json              # shadcn/ui configuration
├── src/
│   ├── app/
│   │   └── globals.css         # Global styles & CSS variables
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       └── dialog.tsx
│   └── lib/
│       └── utils.ts            # cn() utility for className merging
```

---

## CSS Variables

The theming system uses CSS custom properties (variables) for easy customization and dark mode support.

### Color Format

We use **two color formats**:
1. **HSL** - For backwards compatibility and Tailwind CSS v3-style utilities
2. **OKLCH** - Modern color space with better perceptual uniformity (Tailwind v4)

### Location: src/app/globals.css

#### Light Mode Colors (HSL Format)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;        /* Blue */
  --primary-foreground: 210 40% 98%;
  --accent: 24.6 95% 53.1%;            /* Orange */
  --accent-foreground: 60 9.1% 97.8%;
  /* ... other variables */
}
```

#### Light Mode Colors (OKLCH Format)
```css
:root {
  --primary: oklch(0.588 0.208 264.05);  /* Blue */
  --accent: oklch(0.678 0.195 37.69);    /* Orange */
  --chart-1: oklch(0.588 0.208 264.05);  /* Blue */
  --chart-2: oklch(0.678 0.195 37.69);   /* Orange */
  /* ... other variables */
}
```

#### Dark Mode Colors
```css
.dark {
  --primary: oklch(0.651 0.235 264.05);  /* Lighter Blue for dark mode */
  --accent: oklch(0.678 0.195 37.69);    /* Orange (same) */
  /* ... other variables */
}
```

---

## Using Colors in Components

### Via Tailwind Utilities
```tsx
// Primary blue
<button className="bg-primary text-primary-foreground">
  Click me
</button>

// Accent orange
<span className="text-accent">
  Important!
</span>

// Chart colors
<div className="bg-chart-1">Blue chart</div>
<div className="bg-chart-2">Orange chart</div>
```

### Via shadcn/ui Components
```tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Default button uses primary (blue)
<Button>Primary Action</Button>

// Destructive variant
<Button variant="destructive">Delete</Button>

// Badge for highlights
<Badge variant="default">New</Badge>
```

---

## Installed Components

### Core Components
- **Button** - Primary interactive element with multiple variants
- **Card** - Container for content sections
- **Input** - Text input fields
- **Label** - Form labels
- **Table** - Data tables (perfect for leaderboards)
- **Badge** - Status indicators and tags
- **Dialog** - Modal dialogs for match confirmation

### Usage Examples

#### Button
```tsx
import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Match Result</CardTitle>
    <CardDescription>Player vs Player</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

#### Table
```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Rank</TableHead>
      <TableHead>Player</TableHead>
      <TableHead>ELO</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>1</TableCell>
      <TableCell>John Doe</TableCell>
      <TableCell>1500</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Adding New Components

To add more shadcn/ui components:

```bash
cd /path/to/uto-pong
npx shadcn@latest add [component-name]
```

### Commonly Needed Components
```bash
# Forms
npx shadcn@latest add form select checkbox

# Feedback
npx shadcn@latest add toast alert

# Data Display
npx shadcn@latest add avatar tabs

# Overlays
npx shadcn@latest add dropdown-menu popover

# Navigation
npx shadcn@latest add navigation-menu
```

---

## Customizing Colors

### Changing Primary Color
Edit `src/app/globals.css`:

```css
:root {
  /* Change blue to different hue */
  --primary: oklch(0.588 0.208 220);  /* Different blue */
}
```

### Changing Accent Color
```css
:root {
  /* Change orange to different color */
  --accent: oklch(0.678 0.195 120);  /* Green instead */
}
```

### Color Tools
- [OKLCH Color Picker](https://oklch.com/) - Interactive OKLCH color picker
- [Realtime Colors](https://www.realtimecolors.com/) - Preview color schemes
- [shadcn/ui Themes](https://ui.shadcn.com/themes) - Browse theme examples

---

## Dark Mode

Dark mode is supported via the `.dark` class on the `<html>` element.

### Implementation (TODO)
Dark mode toggle needs to be implemented. Here's how:

```tsx
// Example: components/theme-toggle.tsx
"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      Toggle Theme
    </Button>
  )
}
```

### Setup next-themes
```bash
pnpm add next-themes
```

---

## Tailwind CSS v4 Features

This project uses Tailwind CSS v4, which includes:

### New Features
- **OKLCH color space** - Better perceptual color uniformity
- **@import "tailwindcss"** - Simpler import syntax
- **@theme inline** - Inline theme customization
- **@custom-variant** - Custom variant creation
- **tw-animate-css** - Animation utilities

### Migration from v3
If you're used to Tailwind v3:
- No `tailwind.config.js` needed (uses inline `@theme`)
- Import uses `@import "tailwindcss"` instead of `@tailwind`
- Colors use OKLCH format for better color accuracy

---

## Best Practices

### 1. Use the cn() utility
Always use the `cn()` utility from `@/lib/utils` for conditional classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow prop override
)} />
```

### 2. Extend Components, Don't Modify
Never edit files in `src/components/ui/` directly. Instead, create wrapper components:

```tsx
// Good: components/custom-button.tsx
import { Button } from "@/components/ui/button"

export function CustomButton() {
  return <Button className="custom-styling">...</Button>
}
```

### 3. Use Semantic Color Names
Use semantic names like `primary`, `accent`, `destructive` instead of color names:

```tsx
// Good
<div className="bg-primary" />

// Avoid
<div className="bg-blue-500" />
```

### 4. Consistent Spacing
Use the radius variable for consistent border radius:

```tsx
<div className="rounded-lg" />  // Uses --radius-lg
```

---

## TypeScript Support

All shadcn/ui components are fully typed:

```tsx
import { Button, type ButtonProps } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"

// Extend button props
interface CustomButtonProps extends ButtonProps {
  customProp?: string
}
```

---

## Accessibility

shadcn/ui components are built with accessibility in mind:

- **ARIA attributes** - Proper ARIA roles and labels
- **Keyboard navigation** - Full keyboard support
- **Focus management** - Visible focus indicators
- **Screen reader support** - Semantic HTML and ARIA

### Color Contrast
The blue/orange theme has been chosen to ensure:
- WCAG AA compliance for normal text
- WCAG AAA compliance for large text
- Sufficient contrast in both light and dark modes

---

## Resources

### Official Documentation
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) - Primitive components used by shadcn/ui

### Color & Design
- [OKLCH Color Picker](https://oklch.com/)
- [Realtime Colors](https://www.realtimecolors.com/)
- [Coolors](https://coolors.co/) - Color scheme generator

### Learning
- [shadcn/ui Examples](https://ui.shadcn.com/examples)
- [Tailwind UI](https://tailwindui.com/) - Premium components

---

## Troubleshooting

### Components not found
```bash
# Reinstall dependencies
pnpm install

# Check import paths use @/ alias
import { Button } from "@/components/ui/button"
```

### Styles not applying
1. Check `src/app/layout.tsx` imports `./globals.css`
2. Verify `@import "tailwindcss"` is first line in globals.css
3. Restart dev server: `pnpm dev`

### Color variables not working
- Ensure variables are defined in both HSL and OKLCH formats
- Check for typos in variable names
- Verify `@theme inline` block is present

---

## Next Steps

1. **Implement dark mode toggle** - Add theme switcher component
2. **Create custom components** - Build match cards, player cards, etc.
3. **Design rank badges** - Create visual indicators for rank tiers
4. **Add animations** - Use tw-animate-css for smooth transitions
5. **Build layouts** - Create consistent page layouts with navigation

---

**Last Updated:** 2025-11-11
**shadcn/ui Version:** Latest (new-york style)
**Tailwind CSS Version:** v4
