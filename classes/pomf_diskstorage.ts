import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import mkdirp from 'mkdirp';

function getFilename (req: any, file: any, cb: any) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(err, err ? undefined : raw.toString('hex'));
    });
}

function getDestination (req: any, file: any, cb: any) {
    cb(null, os.tmpdir())
}

class PomfDiskStorage {
    getFilename: any;
    getDestination: any;

    constructor(opts: any) {
        this.getFilename = opts.filename || getFilename;
        if (typeof opts.destination === 'string') {
            mkdirp.sync(opts.destination)
            this.getDestination = function ($0:any, $1:any, cb:any) { cb(null, opts.destination) }
        }
        else {
            this.getDestination = (opts.destination || getDestination)
        }
    }

    _handleFile(req: any, file: any, cb: any) {
        let inst = this;
        let hash = crypto.createHash('sha256')
        inst.getDestination(req, file, function (err: any, destination: any) {
            if (err) return cb(err)
    
            inst.getFilename(req, file, function (err: any, filename: any) {
                if (err) return cb(err)
    
                let finalPath = path.join(destination, filename)
                let outStream = fs.createWriteStream(finalPath)
    
                file.stream.pipe(outStream);
    
                outStream.on('error', cb);
                file.stream.on('data', function (chunk: any) {
                    hash.update(chunk, 'utf8');
                });
    
                outStream.on('finish', function () {
                    cb(null, {
                        destination: destination,
                        filename: filename,
                        path: finalPath,
                        size: outStream.bytesWritten,
                        hash: hash.digest('hex')
                    });
                });
            });
        });
    }

    _removeFile(req: any, file: any, cb: any) {
        let path = file.path
    
        delete file.destination
        delete file.filename
        delete file.path
    
        fs.unlink(path, cb)
    }

}

export default PomfDiskStorage;