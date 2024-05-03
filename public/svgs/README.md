## Ensuring compatible svg files with the Svg component

### 1. Add an `id` to the `<svg>` tag

- Recommended to use same name as the file for consistency
- Ensure there is no other `id` attributed

### 2. Change all color values to `"currentColor"`

- If the svg has fixed colors, or is not monochromatic, this step is not applicable
- Not required, but doing so will give the flexibility to change the color of the svg using css
- e.g. `stroke="white"` to `stroke="currentColor"`; or `fill="#FFFFFF"` to `fill="currentColor"`

### 3. Ensure there is no use of the `<style></style>` tag

- Any styles applied to the svg via this tag will not work
- Instead apply the styles inline to the svg paths directly

### Example svg file

```
<svg id="close" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 20L20 4M4 4L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## Understanding intended use of the Svg component

### 1. `src` should follow the pattern of `"/svgs/<svg-name.svg>#<svg-id>"`

### 2. `viewBox` is required

- Take viewBox value from `svg` tag

### 3. Apply color via CSS

- If `"currentColor"` was used within the svg, pass style or classname dictating text color

### Example Svg component usage

```
<Svg
  src="/svgs/close.svg#close"
  title="Close"
  viewBox="0 0 24 24"
  className="text-white"
/>
```
