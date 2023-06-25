import { createJwtToken, verifyGoogleJwtToken } from '../../../lib/auth';
import { LoginResponse } from '../../../generated-types';
import { s } from '../../../lib/status';
import { createUserFromGoogleSignUp, findUserFromGoogleLogin } from '../../../../couchbase/models/users';
import { TokenPayload } from 'google-auth-library';

export async function resolver(_: unknown, { credential }: { credential: string }): Promise<LoginResponse> {
    const payload: TokenPayload = await verifyGoogleJwtToken(credential);
    const existingUser = await findUserFromGoogleLogin(payload.sub);

    if (!existingUser) {
        const user = await createUserFromGoogleSignUp(payload);
        const token = createJwtToken(user);
        return {
            user,
            token,
            status: s(200, 'Sign up successful')
        };
    } else {
        return { status: s(409, 'User already exists') };
    }
}
