
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
  weight: number;
  shape: GemShape;
  clarity: GemClarity;
  dimension_length: number;
  dimension_width: number;
  dimension_height: number;

  // Commercial
  price: number;

  // Arrays
  image_order: GemImage['id'][];

  // Relations
  thumbnail_image_id: GemImage['id'];

  // Nested images
  images: GemImage[];

  // System
  created_at: Date;
  updated_at: Date;
}

