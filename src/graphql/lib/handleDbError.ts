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
import { Status } from "../generated-types";
import { s } from "./status";

function isCouchbaseError(error: unknown): error is CouchbaseError {
  return error instanceof CouchbaseError;
}

export function handleDbError(error: unknown, id?: string): Status {
  if (!(error instanceof Error)) {
    return s(500, `Non-error rejection: ${error}, id: ${id}`);
  }

  if (!isCouchbaseError(error)) {
    return s(500, `Unexpected error: ${error.message}, id: ${id}`);
  }

  if (error instanceof DocumentNotFoundError) {
    return s(404, `Document not found: ${error.message}, id: ${id}`);
  } else if (error instanceof CasMismatchError) {
    return s(409, `CAS mismatch: ${error.message}, id: ${id}`);
  } else if (error instanceof TimeoutError) {
    return s(504, `Timeout: ${error.message}, id: ${id}`);
  } else if (error instanceof RequestCanceledError) {
    return s(503, `Request canceled: ${error.message}, id: ${id}`);
  } else if (error instanceof ServiceNotAvailableError) {
    return s(503, `Service not available: ${error.message}, id: ${id}`);
  } else if (error instanceof DocumentExistsError) {
    return s(409, `Document already exists: ${error.message}, id: ${id}`);
  } else if (error instanceof ValueTooLargeError) {
    return s(413, `Value too large: ${error.message}, id: ${id}`);
  } else {
    return s(500, `Unexpected error: ${error.message}, id: ${id}`);
  }
}
