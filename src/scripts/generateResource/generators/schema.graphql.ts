import { ResourceNameForms } from "../lib/generateResourceNameForms";

export function generateSchemaCode(resourceName: ResourceNameForms): string {
  const { singularLowerCase, singularCapitalized, pluralLowerCase, pluralCapitalized } = resourceName;

  return `type ${singularCapitalized}Content {
    _REPLACE_WITH_YOUR_FIELDS: String
}

input ${singularCapitalized}ContentInput {
  _REPLACE_WITH_YOUR_FIELDS: String
}

input ${singularCapitalized}ContentPatchInput {
  _REPLACE_WITH_YOUR_FIELDS: String
}

input ${pluralCapitalized}ListFiltersInput {
  _REPLACE_WITH_YOUR_FILTERS: String
}


type ${singularCapitalized} {
  id: ID!
  content: ${singularCapitalized}Content!
}

input ${singularCapitalized}ReplaceInput {
  id: ID!
  content: ${singularCapitalized}ContentInput!
}

input ${singularCapitalized}PatchInput {
  id: ID!
  content: ${singularCapitalized}ContentPatchInput!
}

type ${pluralCapitalized}Response {
  records: [${singularCapitalized}]!
  errors: [ErrorResponse]!
}

type ${pluralCapitalized}DeleteResponse {
  deletedIds: [ID]!
  errors: [ErrorResponse]!
}

type ${pluralCapitalized}ListResponse {
  code: Int
  message: String!
  records: [${singularCapitalized}]
}

input ${pluralCapitalized}ListInput {
  filters: ${pluralCapitalized}ListFiltersInput
}

type Mutation {
  ${pluralLowerCase}Create(contents: [${singularCapitalized}ContentInput]!): ${pluralCapitalized}Response
  ${pluralLowerCase}Patch(records: [${singularCapitalized}PatchInput]!): ${pluralCapitalized}Response
  ${pluralLowerCase}Replace(records: [${singularCapitalized}ReplaceInput]!): ${pluralCapitalized}Response
  ${pluralLowerCase}Delete(ids: [ID]!): ${pluralCapitalized}DeleteResponse
}

type Query {
  ${pluralLowerCase}GetByIds(ids: [ID!]!): ${pluralCapitalized}Response
  ${pluralLowerCase}List(query: ${pluralCapitalized}ListInput): ${pluralCapitalized}ListResponse
}
`;
}
