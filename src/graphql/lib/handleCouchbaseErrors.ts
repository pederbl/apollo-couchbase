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

function isCouchbaseError(error: unknown): error is CouchbaseError {
  return error instanceof CouchbaseError;
}

export function handleCouchbaseError(error: unknown, id?: string): ErrorResponse {
  if (!(error instanceof Error)) {
    return {
      id,
      code: 500,
      message: `Non-error rejection: ${error}`,
    };
  }

  if (!isCouchbaseError(error)) {
    return {
      id,
      code: 500,
      message: `Unexpected error: ${error.message}`,
    };
  }

  if (error instanceof DocumentNotFoundError) {
    return {
      id,
      code: 404,
      message: `Document not found: ${error.message}`,
    };
  } else if (error instanceof CasMismatchError) {
    return {
      id,
      code: 409,
      message: `CAS mismatch: ${error.message}`,
    };
  } else if (error instanceof TimeoutError) {
    return {
      id,
      code: 504,
      message: `Timeout: ${error.message}`,
    };
  } else if (error instanceof RequestCanceledError) {
    return {
      id,
      code: 503,
      message: `Request canceled: ${error.message}`,
    };
  } else if (error instanceof ServiceNotAvailableError) {
    return {
      id,
      code: 503,
      message: `Service not available: ${error.message}`,
    };
  } else if (error instanceof DocumentExistsError) {
    return {
      id,
      code: 409,
      message: `Document already exists: ${error.message}`,
    };
  } else if (error instanceof ValueTooLargeError) {
    return {
      id,
      code: 413,
      message: `Value too large: ${error.message}`,
    };
  } else {
    return {
      id,
      code: 500,
      message: `Unexpected error: ${error.message}`,
    };
  }
}
