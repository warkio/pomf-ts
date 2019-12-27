import { PomfFile } from "./pomf_file";

export interface PomfResponse {
    success: boolean;
    files?: PomfFile[];
    errorcode?: number;
    description?:string;
}