import getById from "./getById";
import getList from "./getList";

import type { GemClarity, GemShape, GemVariety } from "~/schema/gems";

const gems = {
  getList: getList,
  getById: getById,
}

export default gems;
