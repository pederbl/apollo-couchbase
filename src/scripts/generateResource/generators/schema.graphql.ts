import { ResourceNameForms } from "../lib/generateResourceNameForms";

export function generateSchemaCode(resourceName: ResourceNameForms): string {
  const { singularLowerCase, singularCapitalized, pluralLowerCase, pluralCapitalized } = resourceName;

  return `type ${singularCapitalized}Content {
  name: String!
  phone: String
}

type ${singularCapitalized} {
  id: ID!
  content: ${singularCapitalized}Content!
}

input ${singularCapitalized}ContentInput {
  name: String!
  phone: String
}

input ${singularCapitalized}ContentPatchInput {
  name: String
  phone: String
}

input ${singularCapitalized}CreateInput {
  content: ${singularCapitalized}ContentInput!
}

input ${singularCapitalized}ReplaceInput {
  id: ID!
  content: ${singularCapitalized}ContentInput!
}

input ${singularCapitalized}PatchInput {
  id: ID!
  content: ${singularCapitalized}ContentPatchInput!
}

input ${singularCapitalized}DeleteInput {
  id: ID!
}

type ${pluralCapitalized}ListResponse {
  code: Int!
  message: String!
  records: [${singularCapitalized}]
}

input ${pluralCapitalized}ListFiltersInput {
  name: String
}

input ${pluralCapitalized}ListInput {
  filters: ${pluralCapitalized}ListFiltersInput
}

type ${pluralCapitalized}GetByIdResponse {
  success: [${singularCapitalized}]
  error: [ErrorResponse]
}

type Mutation {
  ${pluralLowerCase}Create(records: [${singularCapitalized}CreateInput]!): RecordsMutationResponse
  ${pluralLowerCase}Patch(records: [${singularCapitalized}PatchInput]!): RecordsMutationResponse
  ${pluralLowerCase}Replace(records: [${singularCapitalized}ReplaceInput]!): RecordsMutationResponse
  ${pluralLowerCase}Delete(records: [${singularCapitalized}DeleteInput]!): RecordsMutationResponse
}

type Query {
  ${pluralLowerCase}List(query: ${pluralCapitalized}ListInput): ${pluralCapitalized}ListResponse
  ${pluralLowerCase}GetById(ids: [ID!]!): ${pluralCapitalized}GetByIdResponse
}
`;
}
