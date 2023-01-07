import { Router } from "express";
import Logger from "../../loaders/logger.js";
import Comment from "../../models/comments.js"

const router = Router();

/* 
 * /comments/ 와 관련된 routes 
 */
const comments = (app) => {
    app.use("/comments", router);

    /*
     * /api/comments
     * 모든 댓글 조회하기
     * 임시로 router에서 비즈니스 로직을 처리하지만 service에서 처리하도록 수정해야 한다.
     * 1. DB select findAll
     * 2. response JSON
     */
    router.get("/", async (req, res, next) => {
        try {
            Logger.info("comment api");
            res.status(200).json({
                code: 200,
                msg: "success",
            });
        } catch (err) {
            console.log(err);
            Logger.err(err);
            next(err);
        }
    });
};
export default comments;