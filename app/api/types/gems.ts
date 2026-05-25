import type { GemClarity, GemShape, GemVariety } from "~/schema/gems";

export interface GemImage {
  id: string,
  url: string,
  public_id: string,
  alt_text: string | null,
}

export interface Gem {
  // Identity
  id: string;
  inventory_code: string;
  variety: GemVariety;

  // Physical
  weight: string;
  shape: GemShape;
  clarity: GemClarity;
  dimension_length: string;
  dimension_width: string;
  dimension_height: string;

  // Commercial
  price: string;

  // Arrays
  image_order: GemImage['id'][];

  // Relations
  thumbnail_image_id: GemImage['id'];

  // Nested images
  images: GemImage[];

  // System
  created_at: string;
  updated_at: string;
}
