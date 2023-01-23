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
     * 특정한 하나의 게시글 가져오기
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

    /**
     * /api/posts 게시글 작성하기
     * Method : POST
     * /api/imgs 이미지 등록하기 (구현 필요))
     * 
     */
    router.post("/", async(req, res, next) => {
        const {userId, title, content} = req.body;
        try{
            const post = await Posts.create({
                userId : userId,
                title : title,
                content : content
            });
            res.status(200).json({
                code: 200,
                msg: "success",
                data: post
            });
        }catch(err){
            console.log(err);
            Logger.err(err);
            next(err);
        }
    })
    /**
     * /api/posts/:postInfo
     * postInfo: postId(게시글 PK)
     * 하나의 게시글 수정하기
     * EX URL: http://localhost:4000/api/posts/16/5
     * 5 = 데이터베이스에 등록된 userId
     * 16 = 데이터베이스에 등록된 postId
     */
    router.put("/:postId/:userId", async (req, res, next) => {
        const {title, content} = req.body;
        try {
            const postId = req.params.postId;
            const userId = req.params.userId;

            Logger.debug("postId: " + postId);
            Logger.debug("userId: " + userId);
            if (!postId) return res.redirect('/');

            const post = await Posts.update({
                title: title,
                content: content,
            }, { where: { postId: postId, userId:userId }});
            Logger.debug("put One Post: " + post);
            
            if(post == 1) 
            {return res.status(200).json({
                code: 200,
                msg: "success",
                data: post
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
export default posts;

