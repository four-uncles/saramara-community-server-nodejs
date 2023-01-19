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

    /**
     * /api/comments 댓글 작성하기
     * 현재 단계에서 이미지는 고려하지 않았음
     */
    router.post("/", async(req, res, next) => {
        const {userId, postId, content, pick} = req.body;
        try{
            console.log(req.body)
            const comment = await Comment.create({
                userId : userId,
                postId : postId,
                content : content,
                pick:pick
            });
            res.status(200).json({
                code: 200,
                msg: "success",
                data:comment
            });
        }catch(err){
            console.log(err);
            Logger.err(err);
            next(err);
        }
    })

    /**
     * /api/comments/:commentInfo
     * postInfo: postId(게시글 PK)
     * 댓글 수정하기
     * EX URL) http://localhost:4000/api/comments/3/1
     */
    router.put("/:commentId/:userId", async (req, res, next) => {
        const {content, pick} = req.body;
        try {
            const commentId = req.params.commentId;
            const userId = req.params.userId;

            Logger.debug("commentId: " + commentId);
            Logger.debug("userId: " + userId);
            if (!commentId) return res.redirect('/');

            const comment = await Comment.update({
                content: content,
                pick: pick,
            }, { where: { commentId: commentId, userId:userId }});
            Logger.debug("put One Comment: " + comment);
            
            if(comment == 1) 
            {return res.status(200).json({
                code: 200,
                msg: "success",
                data: comment
            })}else {return res.status(500).json({
                code: 500,
                msg: "잘못된 접근 방식 입니다.",
            })}
        } catch (err) {
            console.log(err);
            Logger.err(err);
            next(err);
        }
    });
};
export default comments;