import { api } from "~/api/api";
import type { Gem } from "../types/gems";
import dto from "./dto";

interface PathParams {
  id: Gem['id']
}

type Response = Gem;

export default async function getById(pathParam: PathParams) {

  const response = await api<Response>(`/v1/gems/${pathParam.id}`, {
    method: 'GET',
  });


  return dto(response);
}

