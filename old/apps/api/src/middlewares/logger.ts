import { Request, Response, NextFunction } from "express";

const appLogger = function (req: Request, _res: Response, next: NextFunction) {
    const { path, method, query } = req;
    console.log(new Date().toLocaleString(), method, path, query);
    next();
};

export default appLogger;
