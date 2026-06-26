
import type { GemClarity, GemShape, GemVariety } from "~/schema/gems";

export interface Asset {
  id: string;

  // Identity
  type: "image" | "video";
  isDeleted: boolean;
  orderIndex: number;
  mimeType: string;

  // Relations
  gemId: string;
  image: AssetImage | null;
  video: AssetVideo | null;

  // System
  created_at: Date;
  updated_at: Date;
}

export interface AssetImage {
  id: string,

  // Identity
  url: string;
  public_id: string;
  alt_text: string | null;

  // Relations
  assetId: string;

  // System
  created_at: Date;
  updated_at: Date;
}

export interface AssetVideo {
  id: string;

  // Identity
  url: string;
  public_id: string;

  // Relations
  assetId: string;

  // System
  created_at: Date;
  updated_at: Date;
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

  // Nested assets 
  assets: Asset[];

  // Relations
  featuredAssetId: string | null;

  // System
  created_at: Date;
  updated_at: Date;
}

