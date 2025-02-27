export function ProductDraftMediaOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] size-full font-sans opacity-5">
      <svg width="100vw" height="100vh" id="background-svg">
        <defs>
          <pattern
            id="pattern"
            x="10"
            y="10"
            width="100"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <text
              x="0"
              y="20"
              id="background-text"
              style={{fontSize: '1.5rem', fontWeight: 'bold'}}
            >
              DRAFT
            </text>
          </pattern>
        </defs>
        <rect
          id="background-rect"
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#pattern)"
        />
      </svg>
    </div>
  );
}

ProductDraftMediaOverlay.displayName = 'ProductDraftMediaOverlay';
