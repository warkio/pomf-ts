import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import {db} from '../lib/database';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import config from '../config';
import PomfUpload from "../classes/pomf_upload";
import PomfDiskStorage from '../classes/pomf_diskstorage';

/** Helper functions */

function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const filter = function(req: Request,file: any ,cb: any){
    if(!file.mimetype.startsWith('image')){
        return cb(new Error('Invalid filetype'));
    }
    cb(null,true);
};

const storage = new PomfDiskStorage({
    destination: function (req:any , file:any , cb:any){
        cb(null, config.serverConfig.uploadFolder);
    },
    filename: function (req:any , file:any, cb:any) {
        db.task(async t => {
            //File "extension"
            let extension = path.extname(file.originalname);
            //Random filename
            let name = crypto.randomBytes(getRandomInt(10, 30)).toString('hex') + extension;
            //While the name exists, generate a new one
            while((await t.query("SELECT id FROM pomf_uploads WHERE new_file_name=$1", [name])).length > 0){
                name = crypto.randomBytes(getRandomInt(10, 30)).toString('hex') + extension;
            }
            cb(null, name);
        });

    }
});

/** Routes */

const uploadRoutes = Router();

uploadRoutes.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    if(!res.locals.user && !config.serverConfig.allowAnonymous) {
        return next(new HttpException(400, 'Anonymous uploads are disabled'));
    }
    let up = multer({storage,fileFilter:filter, limits:{fileSize: 50 * 1024 * 1024}}).array('files[]'); // 50 MB
    let files: any[] = [];;
    let result = {success:true,files};
    up(req, res, async err => {
        if(req.files.length === 0) {
            return next(new HttpException(400, 'No input files'));
        }
        if(err) {
            return next(new HttpException(400, err.message));
        }
        // @ts-ignore
        for(const file of req.files) {
            let fileInfo = new PomfUpload(
                file.originalname,
                file.filename,
                // @ts-ignore
                file.hash,
                res.locals.user
            );
            await fileInfo.save();

            result.files.push({
                originalName:file.originalname,
                name:file.filename,
                url: config.serverConfig.uploadUrl+file.filename,
                // @ts-ignore
                hash:file.hash,
                size:file.size
            });
        }
        return res.status(200).send(result);
    });
});

export default uploadRoutes;
