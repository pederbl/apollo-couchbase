import {
  CasMismatchError,
  CouchbaseError,
  DocumentExistsError,
  DocumentNotFoundError,
  RequestCanceledError,
  ServiceNotAvailableError,
  TimeoutError,
  ValueTooLargeError,
} from "couchbase";
import { ErrorResponse } from "../generated-types";
import { e } from "./status";

function isCouchbaseError(error: unknown): error is CouchbaseError {
  return error instanceof CouchbaseError;
}

export function handleCouchbaseError(error: unknown, id?: string): ErrorResponse {
  if (!(error instanceof Error)) {
    return e(500, "Unexpected error", error + " is not of type Error", id);
  }

  if (!isCouchbaseError(error)) {
    return e(500, "Unexpected error", error.message, id);
  }

  if (error instanceof DocumentNotFoundError) {
    return e(404, "Document not found", error.message, id);
  } else if (error instanceof CasMismatchError) {
    return e(409, "CAS mismatch", error.message, id);
  } else if (error instanceof TimeoutError) {
    return e(504, "Timeout", error.message, id);
  } else if (error instanceof RequestCanceledError) {
    return e(503, "Request canceled", error.message, id);
  } else if (error instanceof ServiceNotAvailableError) {
    return e(503, "Service not available", error.message, id);
  } else if (error instanceof DocumentExistsError) {
    return e(409, "Document already exists", error.message, id);
  } else if (error instanceof ValueTooLargeError) {
    return e(413, "Value too large", error.message, id);
  } else {
    return e(500, "Unexpected error", error.message, id);
  }
}
