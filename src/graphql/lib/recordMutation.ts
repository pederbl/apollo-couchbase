import crypto from "crypto";
import { CouchbaseError } from "couchbase";
import { ErrorResponse, RecordsMutationResponse } from "../generated-types";
import { getCouchbaseClient } from "../../couchbase/client";
import { handleCouchbaseError } from "./handleCouchbaseErrors";

export function generateId(prefix: string) {
  return prefix + ":" + crypto.randomUUID();
}

export type RecordMutationResult = {
  success: boolean;
  id: string;
  code: number;
  message: string;
};

export type MutationOperation = "insert" | "replace" | "patch" | "delete";

export async function mutateRecord(
  record: { id: string, content?: any },
  collectionName: string,
  operation: MutationOperation,
): Promise<RecordMutationResult> {
  const { scope } = await getCouchbaseClient();
  const collection = scope.collection(collectionName);

  try {
    switch (operation) {
      case "insert":
        await collection.insert(record.id, record.content);
        break;
      case "replace":
        await collection.replace(record.id, record.content);
        break;
      case "patch":
        const mutationBuilder = collection.mutateIn(record.id);
        for (const field in record.content) {
          mutationBuilder.replace(field, record.content[field]);
        }
        await mutationBuilder.execute();
        break;
      case "delete":
        await collection.remove(record.id);
        break;
      default:
        throw new Error(`Invalid operation: ${operation}`);
    }
    return {
      success: true,
      id: record.id,
      code: 200,
      message: `Success`,
    };
  } catch (error) {
    if (error instanceof CouchbaseError) {
        const errorResult = handleCouchbaseError(error, record.id);
        return { success: false, ...errorResult }
    } else {
         throw new Error(String(error));
    }
  }
}

export async function mutateRecords<T>(
  records: T[],
  recordMutator: (record: T) => Promise<RecordMutationResult>
): Promise<RecordsMutationResponse> {
  const result: RecordsMutationResponse = {
    success: [],
    error: []
  };

  const responses = await Promise.allSettled(records.map(recordMutator));

  for (const response of responses) {
    if (response.status === "fulfilled") {
      if (response.value.success) {
        result.success.push(response.value.id);
      } else {
        result.error.push(response.value as ErrorResponse);
      }
    } else if (response.status === "rejected") {
      result.error.push({
        id: 'UNKNOWN',
        code: 500,
        message: `Unexpected error: ${response.reason}`
      });
    } else {
      throw new Error(`Unexpected response status: ${response}`);
    }
  }

  return result;
}
