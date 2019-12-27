import { Request, Response, NextFunction } from "express";
import { db } from "../lib/database";

/**
 * Gets the owner of the key, as longs as it's a valid one
 * @param key 
 */
async function getKeyOwner(key: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
        db.task(async t => {
            let ownerSearch = await t.query('SELECT id FROM users WHERE api_key=$1', [key])
                .catch(() => {
                    return [];
                });
            if(ownerSearch.length > 0) {
                return resolve(ownerSearch[0].id);
            }
            else {
                return resolve(null);
            }
        });
    });
}

/**
 * Loads the user id of the author of the request
 * @param req 
 * @param res 
 * @param next 
 */
async function userRequestInfo(req: Request, res: Response, next: NextFunction) {
    let userKey = req.headers['app-key'];
    if(typeof(userKey) == 'object') {
        userKey = userKey[0];
    }
    res.locals.user = null;
    if(userKey) {
        let userSearch = await getKeyOwner(userKey);
        res.locals.user = userSearch;
    }
    next();
}

export default userRequestInfo;