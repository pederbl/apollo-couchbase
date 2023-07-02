import { Status, ErrorResponse } from "../generated-types";

export function s(code: number, message: string): Status {
    const codeName: string = (() => {
        switch (code) {
            case 200: return "OK"
            default: return "UNKNOWN"
        }
    })(); 

    return {
        code, 
        codeName,
        message
    }
}

export function e(code: number, label: string, message: string, id?: string): ErrorResponse {
    return {
        code,
        message: label + ": " + message,
        id
    }
}