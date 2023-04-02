import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateGetByIdsCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralLowerCase } = resourceName;

  return `import { handleCouchbaseError } from "apollo-couch";
import { getCouchbaseClient } from "apollo-couch";
import { ${singularCapitalized}, ErrorResponse } from "../../../generated-types";

type PromiseOutcome<T> = {
    status: "fulfilled";
    value: T;
} | {
    status: "rejected";
    reason: ErrorResponse;
};

function reflect(promise: Promise<any>, id: string): Promise<PromiseOutcome<any>> {
    return promise.then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => {
            if (!(reason instanceof Error)) {
                reason = new Error(\`Non-error rejection: \${reason}\`);
            }
            return { status: "rejected", reason: handleCouchbaseError(reason, id) };
        }
    );
}

export async function resolver(ids: string[]) {
    const { bucket } = await getCouchbaseClient();

    const recordPromises = ids.map(id => reflect(bucket.get(id), id));
    const recordResults: PromiseOutcome<any>[] = await Promise.all(recordPromises);

    const success: ${singularCapitalized}[] = [];
    const errors: ErrorResponse[] = [];

    recordResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
            success.push({ id: ids[index], content: result.value });
        } else {
            errors.push(result.reason);
        }
    });

    return {
        success,
        errors,
    };
}
`;
}
