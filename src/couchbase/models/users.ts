import { TokenPayload } from "google-auth-library";
import { getCouchbaseClient } from "../../couchbase/client"; 
import { generateId } from "../generateId";

const COUCHBASE_ACCESS_BUCKET = process.env.COUCHBASE_ACCESS_BUCKET || process.env.COUCHBASE_BUCKET;
const COUCHBASE_ACCESS_SCOPE = process.env.COUCHBASE_ACCESS_SCOPE || process.env.COUCHBASE_SCOPE;

interface DbLoginProfiles {
    google?: TokenPayload
}

export type Role = "ADMIN";

export interface DbUserContent {
    firstName: string, 
    lastName: string, 
    email: string,
    loginProfiles: DbLoginProfiles,
    roles: Role[]
}

export interface DbUser {
    id: string,
    content: DbUserContent
}

function generateUserId(): string {
    return generateId("users"); 
}

export async function findUserFromGoogleLogin(sub: string): Promise<DbUser> {
    const { cluster } = await getCouchbaseClient(); 
    const query = `
        SELECT META().id, users.*
        FROM ${COUCHBASE_ACCESS_BUCKET}.${COUCHBASE_ACCESS_SCOPE}.users
        WHERE users.loginProfiles.google = $googleSub
    `;
    try {
        const result = await cluster.query(query, { parameters: { googleSub: sub } });
        return result.rows[0];
    
    } catch(e) {
        console.log(e); 
        throw e; 
    }
}

export async function createUserFromGoogleSignUp(payload: TokenPayload): Promise<DbUser> {
    const { cluster, bucket } = await getCouchbaseClient();

    if (!payload.given_name) {
        throw new Error("No given_name property"); 
    }

    if (!payload.family_name) {
        throw new Error("No family_name property"); 
    }

    if (!payload.email) {
        throw new Error("No email property"); 
    }

    const content: DbUserContent = {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        loginProfiles: {
            google: payload
        }, 
        roles: []
    };

    const collection = bucket.scope(COUCHBASE_ACCESS_SCOPE).collection('users');
    const id = generateUserId(); 
    await collection.insert(`user::${payload.sub}`, content);
    const user: DbUser = { id, content }
    return user;
}
