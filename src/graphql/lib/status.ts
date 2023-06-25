import { Status } from "../generated-types";

export function s(code: number, message: string): Status {
    return {
        code, 
        message
    }
}