import { Request, Response, NextFunction } from "express";
import config = require("../config");

function configValues(req: Request, res: Response, next: NextFunction) {
    res.locals.serverConfig = config.serverConfig;
    next();
}

export default configValues;