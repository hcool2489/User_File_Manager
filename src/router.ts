import express, { Router, Response, NextFunction } from "express";
import multer from "multer";
import { isSession, login, logout } from "./util/auth";
import { hashIt, UserRequest } from "./util/util";
import fs from "fs";
import admin from "./util/firebase";

const Folder = 'User_Files';

export class RouterClass {
    private router: Router;
    private uploadFile = new UploadManager().upload;

    constructor() {
        this.router = Router();
        this.mountRoutes();
    }

    private mountRoutes(): void {

        this.router.post('/auth/login', login);
        this.router.get('/auth/logout', logout);

        this.router.post('/upload', isSession, this.uploadFile.single('file'), (req: UserRequest, res: Response) => {
            res.redirect('/');
        });

        this.router.get('/download/:file', isSession, (req: UserRequest, res: Response, next: NextFunction) => {
            let path = `${Folder}/${hashIt(req.user.uid)}/${req.params.file}`;
            if (fs.existsSync(path)) {
                res.download(path);
            } else {
                res.status(404).send('404: File Not Found');
            }
        });

        this.router.use('/static', express.static('public/static'));

        this.router.use((req: UserRequest, res: Response, next: NextFunction) => {
            // Dashboard Code

            const sessionCookie = req.cookies.session || "";
            admin.auth().verifySessionCookie(sessionCookie, true)
                .then((user) => {
                    req.user = user;
                    // console.log(req.user);
                    fs.readdir(`${Folder}/${hashIt(req.user.uid)}`, (err, files) => {
                        if (!err) {
                            res.render('dashboard.ejs', {
                                user: req.user,
                                files: files
                            });
                        } else {
                            res.render('dashboard.ejs', {
                                user: req.user,
                                files: []
                            });
                        }
                    });
                }).catch((error) => {
                    express.static('public/auth')(req, res, next);
                });
        });
    }

    public get routes(): Router {
        return this.router;
    }
}

class UploadManager {
    private fileSize = 20 * 1024 * 1024; //20MB max file size
    private storage = multer.diskStorage({
        destination: function (req: UserRequest, file, cb) {
            let path = `${Folder}/${hashIt(req.user.uid)}`;
            fs.mkdirSync(path, { recursive: true })
            cb(null, path);
        },
        filename: function (req, file, cb) {
            // file.filename
            cb(null, file.originalname)
            // cb(null, file.fieldname + "-" + Date.now()+".jpg")
        }
    });

    upload = multer({
        storage: this.storage,
        limits: {
            fileSize: this.fileSize
        }
    });
}