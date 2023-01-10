import passport from "passport";
import kakaoStrategy from './kakaoStrategy.js';

import Users from "../../../models/users.js";

export default () => {

    // 로그인 인증 성공 시 한 번만 실행
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 로그인 인증이 되어 있는 경우, 요청할 때마다 실행
    passport.deserializeUser(async (id, done) => {
        // 세션에 저장되어 있는 id를 인자 값으로 전달 받음
        try {
            const user = await Users.findOne({
                where: {id}
            });
            done(null, user); //req.user 생성
        } catch {
            done(null, false, {
                msg: "서버 문제 발생"
            });
        };
    });

    // kakaoStrategy 등록.
    kakaoStrategy();
}