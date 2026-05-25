type JsonPrimitive = string | number | boolean | null | undefined;

type JsonValue = JsonPrimitive | JsonObject | JsonArray;

interface JsonObject {
  [key: string]: JsonValue;
}

interface JsonArray extends Array<JsonValue> { }

function isJsonPrimitive(value: unknown): value is JsonPrimitive {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === undefined
  );
}

function isJsonArray(value: unknown): value is JsonArray {
  return Array.isArray(value);
}

function isJsonObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export default function sortObject(value: unknown): JsonValue {
  if (isJsonPrimitive(value)) {
    return value;
  }

  if (isJsonArray(value)) {
    return value.map((item) => sortObject(item));
  }

  if (isJsonObject(value)) {
    const result: JsonObject = {};

    for (const key of Object.keys(value).sort()) {
      result[key] = sortObject(value[key]);
    }

    return result;
  }

  throw new Error(
    `Unsupported value type: ${typeof value}`
  );
}
