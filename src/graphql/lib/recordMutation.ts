import crypto from "crypto";

export function generateId(prefix: string) {
  return prefix + ":" + crypto.randomUUID();
}
