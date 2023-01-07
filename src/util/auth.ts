import admin from './firebase';
import { UserRequest } from './util';
import { NextFunction, Response } from 'express';

export function logout(req: UserRequest, res: Response) {
    const sessionCookie = req.cookies.session || "";
    admin.auth().verifySessionCookie(sessionCookie, true)
        .then((user) => {
            req.session.destroy();
            res.clearCookie("session");
            admin.auth().revokeRefreshTokens(user.uid);
        }).catch(err => {
            console.log("Already Logged out");
        }).finally(() => {
            res.redirect("/");
        });
}

export function login(req: UserRequest, res: Response) {
    const expiresIn = 60 * 60 * 12 * 1000;
    admin.auth().createSessionCookie(req.body.idToken, { expiresIn }).then(
        (sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true };
            res.cookie("session", sessionCookie, options);
            res.send(true);
        },
        (error) => {
            console.log(error);
            res.json({
                error: 'Session Creation Error'
            });
        }
    );
}

export function isSession(req: UserRequest, res: Response, next: NextFunction) {
    const sessionCookie = req.cookies.session || "";
    admin.auth().verifySessionCookie(sessionCookie, true)
        .then((user) => {
            req.user = user;
            next();
        }).catch((error) => {
            res.redirect('/');
            // express.static('public/auth')(req, res, next);
        });
}