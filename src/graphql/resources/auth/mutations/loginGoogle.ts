import { DefaultJwtPayload, createJwtPayload, createJwtToken, verifyGoogleJwtToken } from '../../../lib/auth';
import { LoginResponse } from '../../../generated-types';
import { s } from '../../../lib/status';
import { TokenPayload } from 'google-auth-library';
import { DbUser, findUserFromGoogleLogin } from '../../../../couchbase/models/users';

export async function resolver(_: unknown, { credential }: { credential: string }): Promise<LoginResponse> {
    const tokenPayload: TokenPayload = await verifyGoogleJwtToken(credential);
    const user: DbUser = await findUserFromGoogleLogin(tokenPayload.sub);
    if (user) {
        const payload: DefaultJwtPayload = createJwtPayload(user); 
        const token: string = createJwtToken(payload);
        return {
            user,
            token,
            status: s(200, 'Login successful')
        };
    } else {
        return { status: s(401, 'Authentication failed: User not found') };
    }
}
