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
            
            /* console.log(config.jwtSecret)
            console.log(req.body.email);
            console.log(req.body.password); */
        
            const email = req.body.email;
            const password = req.body.password;
        
            const userinfo = await Users.findOne({
              where: {
                email: email,
              }
              
            });
        
            
        
            if (userinfo) {
              const chkId = await email == userinfo.email
              const chkPw = await bcrypt.compare(password, userinfo.password);
              if (chkId && chkPw) {
                const accessToken = jwtService.sign(userinfo);
                const refreshToken = jwtService.refresh();
                
          
                await Tokens.create({
                  refreshToken: refreshToken,
                  email: userinfo.email,
              });
          
                res.status(200).send({
                  ok: true,
                  data: {
                    accessToken,
                    refreshToken,
                  },
                });
                return;
        
              } else {
                res.status(401).send({
                  ok: false,
                  message: 'password is incorrect',
                });
                return;
              }
            }
            res.status(401).send({
              ok: false,
              message: 'user not exist',
            });
        
          }catch(err){
            console.log(err);
            //Logger.err(err);
          }
    })
}

export default login;