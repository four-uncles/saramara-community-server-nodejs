/* 
 * /posts/ 와 관련된 routes 
 */
import { Router } from "express";
import { loggers } from "winston";
import Logger from "../../loaders/logger.js";
import Posts from "../../models/posts.js"

const router = Router();

const posts = (app) => {
    app.use("/posts", router);

    /*
     * /api/posts
     * 모든 게시글 조회
     */
    router.get("/", async (req, res, next) => {
        try {
            Logger.debug("req: " + req.body);
            
            // 임시로 router에서 비즈니스 로직을 처리하지만 service에서 처리하도록 수정해야 한다.
            const posts = await Posts.findAll({
                order: [[ 'createdAt', 'DESC' ]]
            });
            res.status(200).json({ 
                code: 200,
                msg: "success",
                data: posts 
            });
        } catch (err) {
            console.log(err);
            Logger.err(err);
            next(err);
        }
    });

    // 라우터 추가 ..
};
export default posts;

