import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import sessions from "express-session";

dotenv.config();
import { RouterClass } from './router';

const server = express();

server.set('view engine', 'ejs');

server.use(sessions({
    secret: " _ # bygbYV#Y@Y*LBYby8gy7gh18H*^GH*!9phbu",
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 12 * 1000 },
    resave: false
}));

server.use(express.json());
server.use(express.urlencoded());
server.use(cookieParser());

const router = new RouterClass().routes;
server.use(router);

// Error Handler
server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).send('Something Went Wrong');
});

const PORT = process.env.PORT || 3000;

try {
  server.listen(PORT, () => {
    console.log(`⚡️ Server is running on PORT:${PORT}`);
  });
} catch (error) {
  console.log(error)
}