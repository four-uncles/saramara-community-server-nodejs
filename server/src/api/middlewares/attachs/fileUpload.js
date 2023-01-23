import { Router } from "express";
import logger from "winston";
import syncDir from "./syncDir.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import dayjs from "dayjs";
import { v4 } from "uuid";

const day = dayjs();
const uuid = v4();

const storage = () => multer.diskStorage({
    destination(req, file, done) {       
        const type = req.body.type;
        const today = day.format("YYYY-MM-DD");
        const postId = req.body.postId;
        const commentId = req.body.commentId;
        
        logger.info("upload attachs type: " + type);
        logger.info("upload date: " + today);
        logger.info("Attach-postId: " + postId);
        logger.info("Attach-commentId: " + commentId);
        
        /**
         * syncDir 함수
         * 첫번째 매개변수: 게시글(post)이나 댓글(comment) 구분 값
         * 두번째 매개변수: 현재 일자
         * 세번째 매개변수: 게시글번호(postId)
         * 네번째 매개변수: 댓글번호(commentId)
         *  네번째 매개변수를 전달하지 않는다면 게시글 이미지 등록으로 간주한다.
         */
        const imgPath = syncDir(type, today, postId, commentId);
        logger.debug("img upload path: " + imgPath);
        done(null, imgPath);
    },
    filename(req, file, done) {
        /**
         * 첨부 이미지 파일의 이름 결정하는 속성
         * Post(게시글) 이미지의 경우 최대 5개까지 등록이 가능하기에 [UUID+이미 순서] 형식으로 파일명을 만든다.
         * Comment(댓글) 이미지의 경우 1개만 등록할 수 있기 때문에 [UUID] 형식으로 파일명을 만든다.
         */
        const ext = path.extname(file.originalname);
        const type = req.body.type;
        let filename = "";
        if(type === "post") {
            const sequence = req.files.indexOf(req.files[req.files.length -1]);
            filename = uuid + "_" + sequence;
        }
        else {
            filename = uuid;
        }
        logger.info("filename: " + filename);
        done(null, path.basename(filename)+ ext);
    },
});
const limits = { fileSize: 5 * 1024 * 1024 };

const fileUpload = (uploadPath) => multer({
    storage: storage(uploadPath),
    limits: limits,
});

export default fileUpload;
