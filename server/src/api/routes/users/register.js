/* 
 * api/join router
 */
import { Router } from "express";
import Users from "../../../models/users.js";
import Logger from "../../../loaders/logger.js"
import bcrypt from "bcrypt";

const router = Router();

const register = (app) => {
    // 매개변수로 받은 최상위 routes에 index.js를 라우터로 사용하기 위한 Router() 함수를 app으로 받아 
    // 현재 파일을 Router()를 이용해서 라우터로 만들고 최상위 index로 부터 받은 Router() = app 함수를 사용해 현재 파일을 라우터로 등록
    app.use('/register',router);

    // 회원가입 처리 api - middleware 디렉토리 이동 의심 발생
    // TODO : 가입된 회원인지 검증하는 로직 미처리
    router.post("/join", async(req, res, next) => {
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
            //Logger.err(err);
            next(err);

            res.status(409).send({
                code:409,
                message : "failed"
            })
        };
    });

    
};

export default register;
