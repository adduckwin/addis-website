# Addis Coffee - Technical Specification

## Component Inventory

### shadcn/ui Components
- Button - Primary CTAs, actions
- Card - Product cards, service cards
- Input - Newsletter form, search
- Sheet - Mobile navigation drawer
- Separator - Visual dividers
- Badge - Product tags, labels
- Accordion - FAQ section (optional)

### Third-party Components
None required - all components can be built with shadcn/ui + custom styling

### Custom Components
- Header - Fixed navigation with mobile menu
- Hero - Full-screen hero with animated content
- ProductCard - Coffee product display card
- CategoryCard - Large category preview card
- SectionHeader - Consistent section title styling
- ProcessStep - Timeline step component
- TestimonialSlider - Quote carousel
- Footer - Multi-column footer

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero staggered fade-in | Framer Motion | AnimatePresence + staggerChildren | Medium |
| Scroll-triggered reveals | Framer Motion | useInView + motion.div | Medium |
| Product card hover lift | CSS/Tailwind | transition + hover:translate-y | Low |
| Navigation scroll effect | React hooks | useScroll + conditional classes | Low |
| Mobile menu slide-in | Framer Motion | AnimatePresence + slide animation | Medium |
| Process timeline draw | Framer Motion | scaleX animation with useInView | Medium |
| Category card hover | CSS/Tailwind | transition + hover:shadow | Low |
| Testimonial slider | Framer Motion | AnimatePresence + fade transition | Medium |
| Button hover effects | CSS/Tailwind | transition + hover:bg | Low |
| Link underline animation | CSS | ::after pseudo-element animation | Low |

## Animation Library Choices

**Primary: Framer Motion**
- React-native integration
- Declarative animation API
- Built-in scroll detection (useInView)
- AnimatePresence for mount/unmount animations
- Excellent performance

**Secondary: CSS/Tailwind**
- Simple hover states
- Color transitions
- Basic transforms
- No JS overhead for simple effects

## Project File Structure

```
app/
├── sections/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Categories.tsx
│   ├── FeaturedProducts.tsx
│   ├── About.tsx
│   ├── HoReCa.tsx
│   ├── Process.tsx
│   ├── Testimonials.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── components/
│   ├── ProductCard.tsx
│   ├── CategoryCard.tsx
│   ├── SectionHeader.tsx
│   ├── ProcessStep.tsx
│   └── MobileMenu.tsx
├── hooks/
│   └── useScrollPosition.ts
├── lib/
│   └── utils.ts
├── types/
│   └── index.ts
├── page.tsx
├── layout.tsx
└── globals.css
components/ui/    # shadcn components
public/
├── images/       # Generated/downloaded images
└── fonts/        # Custom fonts if needed
```

## Dependencies to Install

```bash
# Animation
npm install framer-motion

# Icons
npm install lucide-react

# Fonts (via Google Fonts in layout)
# Inter - primary font
# Playfair Display - accent font
```

## Technical Notes

### Performance Optimizations
- Use `will-change` on animated elements
- Lazy load images below fold
- Use CSS transforms instead of layout properties
- Implement `prefers-reduced-motion` support

### Responsive Strategy
- Mobile-first approach
- Breakpoints: sm(640), md(768), lg(1024), xl(1280)
- Simplify animations on mobile
- Touch-friendly tap targets (min 44px)

### Accessibility
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast compliance (WCAG AA)

## Build Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  }
}
```

## Development Workflow

1. Initialize project with shadcn
2. Install dependencies
3. Set up global styles and fonts
4. Build layout and navigation
5. Implement sections top-to-bottom
6. Add animations progressively
7. Test responsive behavior
8. Optimize performance
9. Build and deploy
