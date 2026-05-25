const gemsSchema = {
  variety: [
    'diamond',
    'ruby',
    'sapphire',
    'emerald',
  ] as const,

  shape: [
    'emerald',
    'oval',
    'round',
    'cushion',
    'pear',
    'marquise',
    'octagon',
    'square',
    'heart',
    'cabochon',
    'trillion',
    'baguette',
    'tapered_baguette',
    'asscher',
    'princess',
    'radiant',
    'briolette',
  ] as const,

  clarity: [
    'eye_clean',
    'very_slightly_included',
    'slightly_included',
    'moderately_included',
    'heavily_included',
  ] as const,
};

export type GemVariety = (typeof gemsSchema.variety)[number];
export type GemClarity = (typeof gemsSchema.clarity)[number];
export type GemShape = (typeof gemsSchema.shape)[number];

export default gemsSchema;
