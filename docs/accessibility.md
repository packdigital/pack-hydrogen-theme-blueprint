# Accessibility

Blueprint targets **WCAG 2.2 Level AA**. This page covers the conventions that keep it there, how to test, and the known gaps that remain the merchant's or the client build's responsibility.

## Conventions

### Icons: `Svg`

`Svg` is **decorative by default** (`aria-hidden`, `focusable="false"`). Name the control that contains it instead:

```tsx
<button aria-label="Close cart" type="button">
  <Svg src="/svgs/close.svg#close" viewBox="0 0 24 24" />
</button>
```

Only pass `accessibleLabel` when the icon itself carries meaning that no surrounding text does. The old `title` prop is ignored.

### Names: prefer visible text over `aria-label`

`aria-label` replaces an element's text content. Don't add one that repeats the visible text. When you do need one, it must **contain** the visible text (WCAG 2.5.3). For example, a button showing "Set" can be named "Set range to $10 – $50", but not "Apply filter".

### State: expose it, don't put it in the name

| Pattern | Use |
| --- | --- |
| Toggle / selected option | `aria-pressed` (buttons), `aria-current` (links, active thumbnails, current page) |
| Disclosure / dropdown | `aria-expanded` + `aria-controls`, via Headless UI `Disclosure` where possible |
| Sold out / unavailable | Add ", sold out" to the name; use `disabled` only if the control truly does nothing |

Avoid labels that describe state, like "Open menu" / "Close menu". Use `aria-expanded`.

### Dialogs: `Drawer` and `Modal`

Both are Headless UI dialogs, which provide the focus trap, Escape, and scroll lock. Every dialog also needs a **name**:

- `Drawer`: a string `heading` becomes the `DialogTitle`. Otherwise `ariaName` is used.
- `Modal`: named automatically from the first heading in its content, so start modal content with a heading.

### Status messages: `useAnnounce`

Live regions only announce reliably if they exist before their text changes. Don't mount one alongside the message. Use the global announcer instead:

```tsx
const announce = useAnnounce();
announce('Added to cart'); // polite
announce('Could not add to cart', 'assertive'); // errors
```

A form's own result message can instead live in a region that is **always mounted** (`role="status"`), as `EmailSignup` does.

### Forms

- Every input has a `<label>`, which can be `sr-only`. A placeholder is not a label.
- `Select` requires a `label` prop, and `hideLabel` makes it screen-reader-only.
- Add `autoComplete` tokens for personal data: `email`, `given-name`, `address-line1`, `postal-code`, `tel`, and so on (WCAG 1.3.5).
- Render error lists in `role="alert"`.

### Motion

- Autoplaying carousels get a pause button automatically (see `components/Carousel/README.md`).
- For autoplaying or looping `<video>`, use `useVideoPauseControl` with `VideoPlayToggle`. Render the toggle **outside** any link, because a button can't be nested in an `<a>`.
- JS-driven motion should check `usePrefersReducedMotion()`. CSS animations and transitions are neutralized globally under `prefers-reduced-motion`.
- Always give carousels `arrows` or `dots`. Swipe alone fails WCAG 2.5.7.

### Focus

- A global `:focus-visible` ring comes from the `--focus-ring` token. Don't remove outlines without replacing them.
- Use `inert` for content that is hidden but still in the DOM: collapsed `Expand` panels, closed menus, off-screen slides.
- Client-side navigation moves focus to `<main>` and announces the page title. For in-place navigations that should keep focus (e.g. picking a grouped product's color), pass `state={{preserveFocus: true}}` to the `Link`.

### Color

- Text needs 4.5:1 contrast (3:1 for large text). `neutralMedium` (#737373) is the lightest gray that passes on white. `neutralLight` is for decoration only.
- Form control borders use `--input-border` (3:1). `--border` is for decorative dividers only.
- Error text uses `text-red-700`, not `red-500`, which is 3.8:1.

## Testing

### Automated

```sh
npm run test:a11y                                   # starts the dev server
A11Y_BASE_URL=https://preview.example.com npm run test:a11y
```

`tests/a11y` runs axe (WCAG 2.2 AA tags; fails on serious or critical issues) on the home, collection, product, and search pages, plus the cart drawer and mobile menu. It also runs keyboard tests for the skip link, the desktop mega-menu, and the carousel pause controls. The **Accessibility** GitHub workflow runs it on successful preview deployments, or manually with any URL.

axe finds roughly a third of WCAG issues. Keyboard and screen reader checks are still required.

### Manual checklist (per PR touching UI)

Keyboard only:

- [ ] Tab from page load: "Skip to content" appears first and jumps to main.
- [ ] Every interactive element shows a visible focus ring.
- [ ] Desktop nav: Tab to a nav item, then its menu toggle. Enter opens it, Tab moves through the links, and Escape closes it and returns focus.
- [ ] Mobile menu: submenus move focus to "Back", and Back returns focus to the item.
- [ ] Drawers and modals trap focus, close on Escape, and return focus to their trigger.
- [ ] Quick add, filters, sort, and variant options all work without a mouse.
- [ ] Every autoplaying carousel, video, and marquee can be paused.

Screen reader (VoiceOver + Safari, or NVDA + Firefox):

- [ ] Landmarks: banner, "Main" navigation, main, contentinfo. Each nav has a distinct name.
- [ ] Dialogs announce their name ("My Cart", "menu", …).
- [ ] Variant options announce the option group, "selected", and "sold out".
- [ ] Sale prices announce "Regular price … Sale price …".
- [ ] Add to cart, filter results ("Showing N products"), and form results are announced.
- [ ] Images have useful alt text, or are silent if decorative.

## Known gaps

These aren't solved in Blueprint. Client builds and merchants need to handle them:

- **CMS colors.** Section text/background colors, badge colors, RichText inline colors, and text over images (the "Dark Overlay" is a fixed 20%) aren't contrast-checked. Merchants need to choose accessible combinations.
- **Captions.** Video sections have no captions/`<track>` field. Videos with meaningful audio need captions (WCAG 1.2.2) before launch.
- **Linked autoplay video.** A Video section with a link and autoplay has no pause control, since the whole video is the link. Enable "Pause and play" or native controls instead.
- **Heading levels.** Sections render h1 when marked "above the fold", otherwise h2. Nothing prevents two above-the-fold sections from each rendering an h1.
- **Alt text as color key.** Product media alt text doubles as the color-grouping key (see `useProductMedia`). The gallery qualifies these with the product title ("AO Jogger in Black"), but descriptive alt text is better.
- **Marquee** content is duplicated to fill the width, so screen readers may hear it repeated.
- **ESLint.** `jsx-a11y` can't lint our `Link` and `Image` wrappers, because they take `to` and `data.altText` rather than `href` and `alt`. The axe suite covers them at runtime instead.
