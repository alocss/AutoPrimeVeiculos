// No real vehicle photography exists for this seed catalog (see PRODUCT.md → Evidence on Hand).
// Every photo is a labeled placehold.co tile so nobody mistakes it for a real listing photo;
// swap these for real photos via the admin photo uploader before going live.

export const PHOTO_ANGLES = [
  "Frente",
  "Traseira",
  "Lateral direita",
  "Lateral esquerda",
  "Interior - bancos",
  "Painel",
  "Porta-malas",
  "Rodas",
] as const;

const PALETTE: Array<[string, string]> = [
  ["e7e7ea", "555555"],
  ["fdecec", "b52424"],
  ["eef2f7", "334155"],
  ["f5f0e6", "6b5b3a"],
  ["eaf3ee", "1e8e5a"],
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function placeholderPhotoUrl(seed: string, label: string, size = "1200x800"): string {
  const [bg, fg] = PALETTE[hashSeed(seed) % PALETTE.length];
  const text = encodeURIComponent(label);
  return `https://placehold.co/${size}/${bg}/${fg}?text=${text}&font=roboto`;
}

export function vehiclePhotoSet(seed: string): string[] {
  return PHOTO_ANGLES.map((angle) => placeholderPhotoUrl(seed, `${seed}\n${angle}`));
}
