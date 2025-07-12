export type ColorSwatchRecord = Record<string, string[]>;

const rainbow = [
  '#FF0000', // red
  '#FFA500', // orange
  '#FFFF00', // yellow
  '#008000', // green
  '#0000FF', // blue
  '#4B0082', // indigo
  '#EE82EE', // violet
];

export const colorSwatches: ColorSwatchRecord = {
  'blue-matte-orange': ['#1e40af', '#fb923c'],
  'bluegrey-magenta': ['#64748b', '#d946ef'],
  'magenta-blue-grey': ['#d946ef', '#64748b'],
  'blue-yellow': ['#1e40af', '#facc15'],
  'yellow-blue': ['#facc15', '#1e40af'],
  'blue-white': ['#1e40af', '#ffffff'],
  'orange-black': ['#f97316', '#000000'],
  'black-orange': ['#000000', '#f97316'],
  'purple-magenta': ['#7e22ce', '#d946ef'],
  'magenta-purple': ['#d946ef', '#7e22ce'],
  'black-red': ['#000000', '#dc2626'],
  'red-black': ['#dc2626', '#000000'],
  'blue-gold': ['#1e40af', '#fbbf24'],
  'green-orange': ['#15803d', '#f97316'],
  'red-yellow': ['#dc2626', '#facc15'],
  'pink-turquoise': ['#ec4899', '#06b6d4'],
  'dark-grey-red-yellow': ['#4b5563', '#dc2626', '#facc15'],
  'blue-glow-in-the-dark': ['#1e40af', '#a5f3fc'],
  'light-purple-white': ['#a855f7', '#ffffff'],
  'white-light-purple': ['#ffffff', '#a855f7'],
  'matte-orange-blue': ['#fb923c', '#1e40af'],
  'black-white-red': ['#000000', '#ffffff', '#dc2626'],
  'black-white-blue': ['#000000', '#ffffff', '#1e40af'],
  'black-silver-teal': ['#000000', '#c0c0c0', '#008080'],
  'turquoise-black-white': ['#06b6d4', '#000000', '#ffffff'],
  'rainbow-black': [...rainbow, '#000000'],
  'rainbow-white': [...rainbow, '#ffffff'],
  'matte-rainbow-black': [...rainbow, '#000000'],
  'black-brown': ['#000000', '#8B4513'],
  'brown-black': ['#8B4513', '#000000'],
  'white-brown': ['#ffffff', '#8B4513'],
  'brown-white': ['#8B4513', '#ffffff'],
};
