/* ============================================================
   PsyMira — Coloring page SVG outline data.
   Four calming outlines with named regions for interactive fill.
   Each region has a unique `id`, a display `name`, and an SVG
   `d` path string. The viewBox for all outlines is "0 0 400 400".
   ============================================================ */

export type ColoringRegion = {
  id: string;
  name: string;
  d: string;
};

export type ColoringPage = {
  id: string;
  title: string;
  emoji: string;
  regions: ColoringRegion[];
};

export const COLORING_PAGES: ColoringPage[] = [
  {
    id: "flower",
    title: "Flower",
    emoji: "🌸",
    regions: [
      {
        id: "petal-1",
        name: "Top petal",
        d: "M200 80 Q230 120 220 160 Q200 180 180 160 Q170 120 200 80Z",
      },
      {
        id: "petal-2",
        name: "Right petal",
        d: "M260 140 Q280 170 260 200 Q240 220 220 200 Q210 170 260 140Z",
      },
      {
        id: "petal-3",
        name: "Bottom-right petal",
        d: "M240 240 Q260 270 240 300 Q220 310 200 290 Q200 260 240 240Z",
      },
      {
        id: "petal-4",
        name: "Bottom-left petal",
        d: "M160 240 Q140 270 160 300 Q180 310 200 290 Q200 260 160 240Z",
      },
      {
        id: "petal-5",
        name: "Left petal",
        d: "M140 140 Q120 170 140 200 Q160 220 180 200 Q190 170 140 140Z",
      },
      {
        id: "center",
        name: "Center",
        d: "M200 160 Q220 170 230 190 Q230 210 210 220 Q190 230 170 210 Q165 190 180 170 Q190 160 200 160Z",
      },
      {
        id: "stem",
        name: "Stem",
        d: "M195 290 Q195 330 190 360 L210 360 Q205 330 205 290Z",
      },
      {
        id: "leaf-left",
        name: "Left leaf",
        d: "M190 320 Q160 310 140 330 Q150 340 190 330Z",
      },
      {
        id: "leaf-right",
        name: "Right leaf",
        d: "M210 310 Q240 300 260 320 Q250 330 210 320Z",
      },
    ],
  },
  {
    id: "butterfly",
    title: "Butterfly",
    emoji: "🦋",
    regions: [
      {
        id: "wing-tl",
        name: "Top-left wing",
        d: "M200 180 Q160 100 100 100 Q80 140 100 180 Q140 200 200 180Z",
      },
      {
        id: "wing-tr",
        name: "Top-right wing",
        d: "M200 180 Q240 100 300 100 Q320 140 300 180 Q260 200 200 180Z",
      },
      {
        id: "wing-bl",
        name: "Bottom-left wing",
        d: "M200 210 Q160 260 120 280 Q100 260 120 230 Q150 210 200 210Z",
      },
      {
        id: "wing-br",
        name: "Bottom-right wing",
        d: "M200 210 Q240 260 280 280 Q300 260 280 230 Q250 210 200 210Z",
      },
      {
        id: "wing-inner-l",
        name: "Left inner pattern",
        d: "M190 180 Q160 140 130 140 Q120 160 140 175 Q160 185 190 180Z",
      },
      {
        id: "wing-inner-r",
        name: "Right inner pattern",
        d: "M210 180 Q240 140 270 140 Q280 160 260 175 Q240 185 210 180Z",
      },
      {
        id: "body",
        name: "Body",
        d: "M195 160 Q195 150 200 145 Q205 150 205 160 L205 270 Q200 280 195 270Z",
      },
      {
        id: "antenna-l",
        name: "Left antenna",
        d: "M198 155 Q180 120 170 105 Q172 100 176 103 Q188 118 200 152Z",
      },
      {
        id: "antenna-r",
        name: "Right antenna",
        d: "M202 155 Q220 120 230 105 Q228 100 224 103 Q212 118 200 152Z",
      },
    ],
  },
  {
    id: "mandala",
    title: "Mandala",
    emoji: "✨",
    regions: [
      {
        id: "center-circle",
        name: "Center circle",
        d: "M200 175 A25 25 0 1 1 200 225 A25 25 0 1 1 200 175Z",
      },
      {
        id: "ring-n",
        name: "North petal",
        d: "M190 175 Q180 130 200 100 Q220 130 210 175Z",
      },
      {
        id: "ring-ne",
        name: "Northeast petal",
        d: "M215 180 Q245 150 275 145 Q265 175 225 195Z",
      },
      {
        id: "ring-e",
        name: "East petal",
        d: "M225 200 Q270 190 300 200 Q270 210 225 200Z",
      },
      {
        id: "ring-se",
        name: "Southeast petal",
        d: "M215 220 Q245 250 275 255 Q265 225 225 205Z",
      },
      {
        id: "ring-s",
        name: "South petal",
        d: "M210 225 Q220 270 200 300 Q180 270 190 225Z",
      },
      {
        id: "ring-sw",
        name: "Southwest petal",
        d: "M185 220 Q155 250 125 255 Q135 225 175 205Z",
      },
      {
        id: "ring-w",
        name: "West petal",
        d: "M175 200 Q130 190 100 200 Q130 210 175 200Z",
      },
      {
        id: "ring-nw",
        name: "Northwest petal",
        d: "M185 180 Q155 150 125 145 Q135 175 175 195Z",
      },
      {
        id: "outer-n",
        name: "Outer north",
        d: "M185 100 Q175 60 200 40 Q225 60 215 100Z",
      },
      {
        id: "outer-e",
        name: "Outer east",
        d: "M300 185 Q340 175 360 200 Q340 225 300 215Z",
      },
      {
        id: "outer-s",
        name: "Outer south",
        d: "M215 300 Q225 340 200 360 Q175 340 185 300Z",
      },
      {
        id: "outer-w",
        name: "Outer west",
        d: "M100 215 Q60 225 40 200 Q60 175 100 185Z",
      },
    ],
  },
  {
    id: "mountains",
    title: "Mountain Scene",
    emoji: "⛰️",
    regions: [
      {
        id: "sky",
        name: "Sky",
        d: "M0 0 L400 0 L400 200 Q300 180 200 200 Q100 220 0 200Z",
      },
      {
        id: "sun",
        name: "Sun",
        d: "M300 60 A30 30 0 1 1 300 120 A30 30 0 1 1 300 60Z",
      },
      {
        id: "mountain-left",
        name: "Left mountain",
        d: "M0 300 L80 120 L160 280 L0 300Z",
      },
      {
        id: "mountain-center",
        name: "Center mountain",
        d: "M100 300 L200 80 L300 300Z",
      },
      {
        id: "mountain-right",
        name: "Right mountain",
        d: "M240 300 L320 140 L400 280 L400 300Z",
      },
      {
        id: "snow-left",
        name: "Left snow cap",
        d: "M80 120 L60 160 L70 150 L85 165 L95 150 L100 160Z",
      },
      {
        id: "snow-center",
        name: "Center snow cap",
        d: "M200 80 L175 130 L185 120 L195 135 L205 115 L215 130 L225 120Z",
      },
      {
        id: "lake",
        name: "Lake",
        d: "M60 320 Q120 300 200 310 Q280 320 340 310 Q360 340 340 360 Q280 370 200 365 Q120 370 60 360 Q40 340 60 320Z",
      },
      {
        id: "ground",
        name: "Ground",
        d: "M0 300 Q100 290 200 300 Q300 310 400 300 L400 400 L0 400Z",
      },
      {
        id: "tree-1",
        name: "Left tree",
        d: "M50 280 L60 240 L55 245 L65 210 L60 215 L68 180 L76 215 L71 210 L80 245 L75 240 L85 280Z",
      },
      {
        id: "tree-2",
        name: "Right tree",
        d: "M350 260 L358 225 L354 230 L362 200 L358 205 L365 175 L372 205 L368 200 L375 230 L371 225 L378 260Z",
      },
    ],
  },
  {
    id: "stained-glass",
    title: "Stained Glass",
    emoji: "🪟",
    regions: [
      { id: "outer", name: "Outer", d: "M200 10 A190 190 0 1 1 200 390 A190 190 0 1 1 200 10 M200 30 A170 170 0 1 0 200 370 A170 170 0 1 0 200 30" },
      { id: "w0", name: "Wedge 0", d: "M240 200 L370 200 A170 170 0 0 1 347.22 285 L234.64 220 A40 40 0 0 0 240 200Z" },
      { id: "w1", name: "Wedge 1", d: "M234.64 220 L347.22 285 A170 170 0 0 1 285 347.22 L220 234.64 A40 40 0 0 0 234.64 220Z" },
      { id: "w2", name: "Wedge 2", d: "M220 234.64 L285 347.22 A170 170 0 0 1 200 370 L200 240 A40 40 0 0 0 220 234.64Z" },
      { id: "w3", name: "Wedge 3", d: "M200 240 L200 370 A170 170 0 0 1 115 347.22 L180 234.64 A40 40 0 0 0 200 240Z" },
      { id: "w4", name: "Wedge 4", d: "M180 234.64 L115 347.22 A170 170 0 0 1 52.78 285 L165.36 220 A40 40 0 0 0 180 234.64Z" },
      { id: "w5", name: "Wedge 5", d: "M165.36 220 L52.78 285 A170 170 0 0 1 30 200 L160 200 A40 40 0 0 0 165.36 220Z" },
      { id: "w6", name: "Wedge 6", d: "M160 200 L30 200 A170 170 0 0 1 52.78 115 L165.36 180 A40 40 0 0 0 160 200Z" },
      { id: "w7", name: "Wedge 7", d: "M165.36 180 L52.78 115 A170 170 0 0 1 115 52.78 L180 165.36 A40 40 0 0 0 165.36 180Z" },
      { id: "w8", name: "Wedge 8", d: "M180 165.36 L115 52.78 A170 170 0 0 1 200 30 L200 160 A40 40 0 0 0 180 165.36Z" },
      { id: "w9", name: "Wedge 9", d: "M200 160 L200 30 A170 170 0 0 1 285 52.78 L220 165.36 A40 40 0 0 0 200 160Z" },
      { id: "w10", name: "Wedge 10", d: "M220 165.36 L285 52.78 A170 170 0 0 1 347.22 115 L234.64 180 A40 40 0 0 0 220 165.36Z" },
      { id: "w11", name: "Wedge 11", d: "M234.64 180 L347.22 115 A170 170 0 0 1 370 200 L240 200 A40 40 0 0 0 234.64 180Z" },
      { id: "s0", name: "Star 0", d: "M200 200 L215 200 L200 240 L207.5 213 Z" },
      { id: "s1", name: "Star 1", d: "M200 200 L207.5 213 L165.36 220 L192.5 213 Z" },
      { id: "s2", name: "Star 2", d: "M200 200 L192.5 213 L160 200 L185 200 Z" },
      { id: "s3", name: "Star 3", d: "M200 200 L185 200 L200 160 L192.5 187 Z" },
      { id: "s4", name: "Star 4", d: "M200 200 L192.5 187 L234.64 180 L207.5 187 Z" },
      { id: "s5", name: "Star 5", d: "M200 200 L207.5 187 L240 200 L215 200 Z" }
    ]
  },
  {
    id: "crystal",
    title: "Magic Crystal",
    emoji: "💎",
    regions: [
      { id: "co0", name: "Outer Facet 0", d: "M250 200 L380 200 L320 284.85 L235.35 235.35 Z" },
      { id: "ci0", name: "Inner Facet 0", d: "M200 200 L250 200 L235.35 235.35 Z" },
      { id: "co1", name: "Outer Facet 1", d: "M235.35 235.35 L320 284.85 L200 380 L200 250 Z" },
      { id: "ci1", name: "Inner Facet 1", d: "M200 200 L235.35 235.35 L200 250 Z" },
      { id: "co2", name: "Outer Facet 2", d: "M200 250 L200 380 L80 284.85 L164.64 235.35 Z" },
      { id: "ci2", name: "Inner Facet 2", d: "M200 200 L200 250 L164.64 235.35 Z" },
      { id: "co3", name: "Outer Facet 3", d: "M164.64 235.35 L80 284.85 L20 200 L150 200 Z" },
      { id: "ci3", name: "Inner Facet 3", d: "M200 200 L164.64 235.35 L150 200 Z" },
      { id: "co4", name: "Outer Facet 4", d: "M150 200 L20 200 L80 115.15 L164.64 164.64 Z" },
      { id: "ci4", name: "Inner Facet 4", d: "M200 200 L150 200 L164.64 164.64 Z" },
      { id: "co5", name: "Outer Facet 5", d: "M164.64 164.64 L80 115.15 L200 20 L200 150 Z" },
      { id: "ci5", name: "Inner Facet 5", d: "M200 200 L164.64 164.64 L200 150 Z" },
      { id: "co6", name: "Outer Facet 6", d: "M200 150 L200 20 L320 115.15 L235.35 164.64 Z" },
      { id: "ci6", name: "Inner Facet 6", d: "M200 200 L200 150 L235.35 164.64 Z" },
      { id: "co7", name: "Outer Facet 7", d: "M235.35 164.64 L320 115.15 L380 200 L250 200 Z" },
      { id: "ci7", name: "Inner Facet 7", d: "M200 200 L235.35 164.64 L250 200 Z" }
    ]
  },
  {
    id: "geo-fox",
    title: "Geo Fox",
    emoji: "🦊",
    regions: [
      { id: "f1", name: "Left Ear Outer", d: "M110 80 L140 160 L80 220 Z" },
      { id: "f2", name: "Right Ear Outer", d: "M290 80 L320 220 L260 160 Z" },
      { id: "f3", name: "Left Ear Inner", d: "M110 80 L200 90 L140 160 Z" },
      { id: "f4", name: "Right Ear Inner", d: "M290 80 L260 160 L200 90 Z" },
      { id: "f5", name: "Crown Left", d: "M200 90 L200 150 L140 160 Z" },
      { id: "f6", name: "Crown Right", d: "M200 90 L260 160 L200 150 Z" },
      { id: "f7", name: "Left Eye Area", d: "M140 160 L160 200 L200 150 Z" },
      { id: "f8", name: "Right Eye Area", d: "M260 160 L200 150 L240 200 Z" },
      { id: "f9", name: "Left Cheek Upper", d: "M140 160 L80 220 L160 200 Z" },
      { id: "f10", name: "Right Cheek Upper", d: "M260 160 L240 200 L320 220 Z" },
      { id: "f11", name: "Left Cheek Lower", d: "M80 220 L140 270 L160 200 Z" },
      { id: "f12", name: "Right Cheek Lower", d: "M320 220 L240 200 L260 270 Z" },
      { id: "f13", name: "Left Snout Side", d: "M160 200 L140 270 L200 300 Z" },
      { id: "f14", name: "Right Snout Side", d: "M240 200 L200 300 L260 270 Z" },
      { id: "f15", name: "Snout Top", d: "M200 150 L160 200 L200 300 L240 200 Z" }
    ]
  }
];

/** Curated pastel palette for the coloring tool */
export const COLORING_PALETTE = [
  "#f8b4c8", // soft pink
  "#f7c6a3", // peach
  "#f9e4a0", // butter yellow
  "#b8e6b8", // mint green
  "#a8d8e8", // sky blue
  "#c4b5fd", // lavender
  "#dbb5f0", // lilac
  "#f0c0c0", // rose
  "#c8e0c0", // sage
  "#e0d0b8", // sand
  "#d0c0e0", // thistle
  "#ffffff", // white
  "#ff9999", // salmon
  "#ffcc99", // apricot
  "#ffff99", // pale lemon
  "#99ff99", // light neon green
  "#99ffff", // cyan
  "#9999ff", // periwinkle
  "#ff99ff", // magenta pink
  "#c0c0c0", // silver
  "#333333", // charcoal
];
