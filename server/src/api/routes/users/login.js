/* 
 * api/join router
 */
import { Router } from "express";
import Users from "../../../models/users.js";
import Logger from "../../../loaders/logger.js"
import bcrypt from "bcrypt";

const router = Router();

const login = (app) => {
    // 매개변수로 받은 최상위 routes에 index.js를 라우터로 사용하기 위한 Router() 함수를 app으로 받아 
    // 현재 파일을 Router()를 이용해서 라우터로 만들고 최상위 index로 부터 받은 Router() = app 함수를 사용해 현재 파일을 라우터로 등록
    app.use(router)
}