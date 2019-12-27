import {db} from '../lib/database';

class PomfUpload {
    originalName: string;
    newName: string;
    hashValue: string;
    uploadedBy: number | null;
    
    constructor(originalName: string, newName: string, hashValue: string, uploadedBy: number | null) {
        this.originalName = originalName;
        this.newName = newName;
        this.hashValue = hashValue;
        this.uploadedBy = uploadedBy;
    }

    async save() {
        return new Promise((resolve, reject) => {
            db.task(async t => {
                await t.query(
                    'INSERT INTO pomf_uploads(original_name, new_file_name, hash_value, uploaded_by) VALUES ($1,$2,$3,$4)',
                    [this.originalName, this.newName, this.hashValue, this.uploadedBy]
                );
                return resolve();
            });
        })
    }
}

export default PomfUpload;