/* 
 * api/login router
 */
import { Router } from "express";
import Users from "../../../models/users.js";
import Tokens from "../../../models/tokens.js"
import Logger from "../../../loaders/logger.js"
import config from '../../../config/config.js';
import jwtService from "../../../services/jwtService.js";
import bcrypt from "bcrypt";


const router = Router();

const login = (app) => {
    // 매개변수로 받은 최상위 routes에 index.js를 라우터로 사용하기 위한 Router() 함수를 app으로 받아 
    // 현재 파일을 Router()를 이용해서 라우터로 만들고 최상위 index로 부터 받은 Router() = app 함수를 사용해 현재 파일을 라우터로 등록
    app.use('/users',router);
    router.post("/checkId", async(req, res, next) => {
        try{

            const email = req.body.email;
            const password = req.body.password;


            // Users DB 에 클라이언트 POST 요청의 Body로 부터 온 email을 기준으로 해당되는 user 정보가 있는지
            const userinfo = await Users.findOne({
              where: {
                email: email,
              }
              
            });
            
            // 유저정보가 있을때
            if (userinfo) {
              console.log(userinfo.role);
              // 입력한 password 가 암호화된 DB user 정보의 password와 일치하는지 
              // id 에 대한 email이 일치하는 지 여부는 이미 userinfo를 불러올 때 클라리언트에서 입력한 email이 있는지 여부를 검사하기 때문에 
              // 불필요하게 할 필요 X
              const chkPw = await bcrypt.compare(password, userinfo.password);

              if (chkPw) { // 앞의 유효성 검사가 같을 때

                // ../../Service/jwtService 의 sign(), refresh()로 
                // access, refresh 토큰 생성
                const accessToken = jwtService.sign(userinfo);
                const refreshToken = jwtService.refresh();
                
              
                // refresh 토큰을 redis 혹은 nginx 를 docker에 띄워서 사용하려 했으나 문제를 해결하지 못해
                // DB 의 Session 보다는 DB 테이블로 따로 관리하는 것이 더 효율적이라고 생각해서 따로 관리
                // express-session에 너무 많은 키를 가지고 있으면 성능 저하 우려.
              await Tokens.create({
                  refreshToken: refreshToken,
                  email: userinfo.email,
              });
              

              // 로그인 에 성공한 경우 클라이언트로 access, refresh token 발급
                res.status(200).json({
                  ok: true,
                  data: { 
                    accessToken,
                    refreshToken,
                  },
                });
                return;
              
              // 입력받은 email은 일치하나 비밀번호가 틀린경우 
              } else {
                res.status(401).json({
                  ok: false,
                  message: 'password is incorrect',
                });
                return;
              }
            }

            // 클라이언트 post 요청 body 의 email이 일치하지 않는 경우
            res.status(401).json({
              ok: false,
              message: 'user not exist',
            });
        
          }catch(err){
            console.log(err);
            //Logger.err(err);
            next(err);
          }
    })
}

export default login;