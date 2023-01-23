import { Router } from "express";
import logger from "winston";
import fs from "fs";

const syncDir = (type, date, postid, commentid) => {
    let dirName = "public/img/" + date;
    if (type === "post") {
        dirName += "/post/" + postid;
    }
    else {
        dirName += "/post/" + postid + "/comment/" + commentid;
    }
    // 이미지를 업로드할 게시글이나 댓글의 디렉토리가 없을 경우 생성한다.
    try {
        fs.readdirSync(dirName);
    } catch (error) {
        console.error("not found directory - " + type);
        logger.error("not found directory - " + type);
        fs.mkdirSync(dirName, { recursive: true });
    }

    return dirName;
};

export default syncDir;
