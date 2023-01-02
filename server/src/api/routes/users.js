/* 
 * /users/ 와 관련된 routes 
 */
import { Router } from "express";
import Users from "../../models/users.js";
import Logger from "../../loaders/logger.js"
import bcrypt from "bcrypt";

const router = Router();

const users = (app) => {
    app.use(router);
    // 회원가입 처리 api - middleware 디렉토리 이동 의심 발생
    // TODO : 가입된 회원인지 검증하는 로직 미처리
    router.post("/register/join", async(req, res, next) => {
        const {email, password, nickname} = req.body;
        
        // 비밀번호 해싱 처리화
        const hashedPassword = await bcrypt.hash(password, 1);

        try {
            await Users.create({
                type:'LOCAL',
                email:email,
                password: hashedPassword,
                nickname: nickname,
                role:'BASIC',
                profileImg:'default.jpg'
            });

            res.status(200).send({
                code:200,
                message: "success"
            })

        } catch(err) {
            console.log(err);
            Logger.err(err);
            next(err);

            res.status(409).send({
                code:409,
                message : "failed"
            })
        };
    });

    
};

export default users;
