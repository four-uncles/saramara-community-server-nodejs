import { Router } from "express";
import passport from "passport";

const router = Router();

const kakao = (app) => {

    app.use(router);

    // 카카오 로그인을 get 요청을 하면 passport 인증을 하러 감.
    router.get('/kakaoOuthLogin' , passport.authenticate('kakao'));

    // 카카오 서버 로그인이 된다면, 카카오 redirect URL 설정에 따라 이쪽 라우터로 오게 됨.
    router.get('/kakao/callback',
    
    // passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교하여 회원가입 진행.
    passport.authenticate('kakao', {
        failureRedirect:'/', // kakaoStrategy에서 실패한다면 실행됨.
    }),
    // kakaoStragegy에서 성공한다면 콜백 실행
    (req, res) => {
        res.redirect('/');
    },
    );
}

export default kakao;