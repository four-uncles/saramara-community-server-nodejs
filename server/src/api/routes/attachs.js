import { Router } from "express";
import dayjs from "dayjs";

import logger from "winston";
import Logger from "../../loaders/logger.js";
import upload from "../middlewares/attachs/index.js";

const router = Router();
const today = dayjs();

/** 
 * 첨부파일 이미지와 관련된 routes 
 */
const attachs = (app) => {
    app.use("/attachs", router);

    router.get("/", async (req, res, next) => {
        try {
            const date = today.format("YYYY-MM-DD");
            const imgPath = upload.syncDir("post", date, 2);
            logger.info(imgPath);

            res.status(200).json({
                code: 200,
                msg: "success"
            });
        } catch (err) {
            console.log(err);
            logger.error(err);
            next(err);
        }
    });

    /**
     * /api/posts/imgs/:postId
     * 모든 게시글과 댓글의 이미지 가져오기
     * 
     * 임시로 router에서 비즈니스 로직을 처리하지만 service에서 처리하도록 수정해야 한다.
     * 
     */
    router.get("/:postId", async (req, res, next) => {
        try {
            /** 
             * 해당 게시글(postId)과 게시글에 연결된 댓글에 대한 첨부파일 이미지 가져오기 
             */

            res.status(200).json({
                code: 200,
                msg: "success",
                data: {}
            });
        } catch (err) {
            console.log(err);
            Logger.err(err);
            next(err);
        }
    });
};

export default attachs;