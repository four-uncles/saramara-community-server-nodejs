import { Router } from "express";
import logger from "winston";

import multer from "multer";
import path from "path";
import fs from "fs";

const fileUpload = () => multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const fileName = `${path.basename(
                file.originalname,
                ext
            )}_${Date.now()}${ext}`;
            done(null, fileName);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default fileUpload;
