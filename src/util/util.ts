import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Request, Response } from 'express';
import md5 from "md5";

export interface UserRequest extends Request {
    user: DecodedIdToken;
    session: any;
}

export function hashIt(text: string): string {
    const salt = 'H891 2L1';
    return md5(`${salt}${text}`);
}