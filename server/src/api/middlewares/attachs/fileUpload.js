import { Router } from "express";
import logger from "winston";

import syncDir from "./syncDir.js";

import multer from "multer";
import path from "path";
import fs from "fs";
import dayjs from "dayjs";

const day = dayjs();

const storage = () => multer.diskStorage({
    destination(req, file, done) {
        const today = day.format("YYYY-MM-DD");
        /**
         * syncDir 함수
         * 첫번째 매개변수: 게시글(post)이나 댓글(comment) 구분 값
         * 두번째 매개변수: 현재 일자
         * 세번째 매개변수: 게시글번호(postId)나 댓글번호(commentId)
         */
        
        /**
         * 현재 디렉토리 생성시 게시글번호 파라미터가 하드코딩 되어 있는데 - syncDir 함수의 세번째 파라미터
         * 게시글 등록 API와 함께 이미지를 등록할 것이기 때문에 게시글번호를 파라미터로 받아와야 한다.
         */
        const imgPath = syncDir("post", today, 2);
        logger.debug("img upload path: " + imgPath);
        done(null, imgPath);
    },
    filename(req, file, done) {
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
});
const limits = { fileSize: 5 * 1024 * 1024 };

const fileUpload = (uploadPath) => multer({
    storage: storage(uploadPath),
    limits: limits,
});

export default fileUpload;
