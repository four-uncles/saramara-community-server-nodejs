import { Router } from "express";
import Logger from "../../loaders/logger.js";
import Posts from "../../models/posts.js"
import Comments from "../../models/comments.js";

const router = Router();

/**
 * /posts/ 와 관련된 routes   
 */
const posts = (app) => {
    app.use("/posts", router);

    /**
     * /api/posts
     * 모든 게시글 가져오기
     * 
     * 임시로 router에서 비즈니스 로직을 처리하지만 service에서 처리하도록 수정해야 한다.
     * 1. DB select findAll
     * 2. response JSON
     */
    router.get("/", async (req, res, next) => {
        try {
            const posts = await Posts.findAll({
                order: [['createdAt', 'DESC']]
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

    /**
     * /api/posts/:postInfo
     * postInfo: postId(게시글 PK)
     * 하나의 게시글 가져오기
     * 
     * 임시로 router에서 비즈니스 로직을 처리하지만 service에서 처리하도록 수정해야 한다.
     * 1. Read Parameter postId
     * 2. DB select findOne (where = postId)
     * 3. get Comments include Posts
     * 4. response JSON
     */
    router.get("/:postId", async (req, res, next) => {
        try {
            const postId = req.params.postId;
            Logger.debug("postId: " + postId);
            if (!postId) return res.redirect('/');

            const post = await Posts.findOne({
                include: [ { model: Comments} ],
                where: { postId: postId }
            });
            Logger.debug("get One Post: " + post);
            
            res.status(200).json({
                code: 200,
                msg: "success",
                data: post
            });
        } catch (err) {
            console.log(err);
            Logger.err(err);
            next(err);
        }
    });

    

};
export default posts;

