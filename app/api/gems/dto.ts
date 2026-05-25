import type { Gem as UiGem } from "~/stores/types/gems";
import type { Gem } from "../types/gems";

export default function dto(gem: Gem): UiGem {
  return {
    ...gem,
    weight: Number(gem.weight),
    dimension_height: Number(gem.dimension_height),
    dimension_length: Number(gem.dimension_length),
    dimension_width: Number(gem.dimension_width),
    price: Number(gem.price),
    created_at: new Date(gem.created_at),
    updated_at: new Date(gem.updated_at)
  }
}
