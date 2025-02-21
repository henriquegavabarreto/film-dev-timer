import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "./firebaseAdmin";

const getDecodedToken = async (req: Request): Promise<DecodedIdToken> => {
    try {
        const authHeader = req.headers.get('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Auth token is invalid or missing');
        }

        const token = authHeader.split(' ')[1]; // Extract token from header
        const decodedToken = await adminAuth.verifyIdToken(token); // Verify the token

        if (!decodedToken) {
            throw new Error('Invalid token');
        }

        return decodedToken;
    } catch (error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message)
        }
        throw new Error('Could not verify token.')
    }
}

export { getDecodedToken };