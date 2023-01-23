import { Router } from "express";
import logger from "winston";
import Logger from "../../loaders/logger.js";
import upload from "../middlewares/attachs/index.js";
import Attachs from "../../models/attachs.js";
import { Op } from "sequelize";

const router = Router();
const fileUpload = upload.fileUpload();

/** 
 * 첨부파일 이미지와 관련된 routes 
 */
const attachs = (app) => {
    app.use("/attachs", router);

    /**
     * 모든 게시글의 이미지 가져오기
     * 모든 게시글 가져오는 API[/api/post]와 함께 호출되어야 한다.
     */
    router.get("/", async (req, res, next) => {
        try {
            const attachs = await Attachs.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json({
                code: 200,
                msg: "success",
                data: attachs
            });
        } catch(err) {
            console.log(err);
            logger.error(err);
            next(err);
        }
    });

    /**
     * /api/attachs/posts/:postInfo
     * 특정 게시글의 이미지 가져오기
     * 하나의 게시글 가져오는 API[/api/posts/:postInfo]와 함께 호출되어야 한다.
     * 게시글 등록 이미지와 댓글 이미지를 모두 가져온다.
     * 임시로 router에서 비즈니스 로직을 처리하지만 service에서 처리하도록 수정해야 한다.
     * 
     */
    router.get("/posts/:postInfo", async (req, res, next) => {
        try {
            const postId = req.params.postInfo;
            const postImgPath = await Attachs.findAll({
                where: { 
                    img: {
                        [Op.like]: "%post/" + postId
                    } 
                }
            })
            const commentImgPath = await Attachs.findAll({
                where: {
                    img: {
                        [Op.like]: "%post/" + postId + "/comment/%"
                    }
                }
            })
            res.status(200).json({
                code: 200,
                msg: "success",
                data: {
                    "postAttachs": postImgPath,
                    "commentAttachs": commentImgPath
                }
            });
        } catch (err) {
            console.log(err);
            Logger.err(err);
            next(err);
        }
    });

     /**
     * Post(게시글)의 Attach(이미지 첨부파일) 업로드하기
     * 해당 API는 /api/posts 게시글 등록 API 작업 이후 호출된다.
     * 게시글의 이미지는 최소 1개부터 최대 5개까지 업로드할 수 있다.
     */
     router.post("/posts", fileUpload.array("postImg", 5), async (req, res, next) => {
        try {
            logger.info("post-files: " + JSON.stringify(req.files));
            const files = req.files;
            const size = files.length;
            for(let i=0; i<size; i++) {
                const path = files[i].destination.replace("public/img/", "");
                const attachs = await Attachs.create({
                    img: path
                });
            }
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
     * Comment(댓글)의 Attach(이미지 첨부파일) 업로드하기
     * 해당 API는 /api/comments 댓글 등록 API 작업 이후 호출된다.
     * 댓글의 이미지는 1개만 업로드할 수 있다.
     */
    router.post("/comments", fileUpload.single("commentImg"), async (req, res, next) => {
        try {
            logger.info("comment-file: " + JSON.stringify(req.file));
            const path = req.file.destination.replace("public/img/", "");
            const attach = await Attachs.create({
                img: path
            });
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
};

export default attachs;