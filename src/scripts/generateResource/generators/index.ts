export { generateSchemaCode } from "./schema.graphql.js";
export {
  generateCreateCode,
  generateDeleteCode,
  generatePatchCode,
  generateReplaceCode,
} from "./mutation/index.js";
export {
  generateGetByIdsCode, 
  generateListCode
} from "./query/index.js";