import { api } from "~/api/api";
import type { GemClarity, GemShape, GemVariety } from "~/schema/gems";
import type { Gem } from "../types/gems";
import dto from "./dto";

interface QueryParams {
  // Pagination
  page?: number;
  limit?: number;

  sort_by?: "id" | "created_at" | "updated_at" | "price" | "weight";
  sort_order?: "asc" | "desc";

  // Filters
  clarity?: GemClarity;
  shape?: GemShape;
  variety?: GemVariety;

  price_min?: number;
  price_max?: number;

  weight_min?: number;
  weight_max?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

interface Response {
  items: Gem[];
  pagination: Pagination;
}

export default async function getList(queryParam: QueryParams, signal?: AbortSignal) {
  const response = await api<Response>('/v1/gems', {
    method: 'GET',
    query: {
      ...queryParam,
      limit: 8
    },
    signal,
  });

  return {
    ...response,
    items: response.items.map(gem => dto(gem)),
  };
}

