import passport from "passport";
import { Strategy as KakaoStrategy} from "passport-kakao";
import Users from "../../../models/users.js";

const kakaoStrategy = () => {
    passport.use(new KakaoStrategy(
        {
            clientID: process.env.KAKAO_ID, // 카카오 REST API KEY
            callbackURL:'/api/kakao/callback', // 카카오 로그인 Redirect URI
        },

        async (accessToken, refreshToken, profile, done) => {
            console.log('kakao profile', profile);
            try {

                // 회원 정보 찾기
                const exUser = await Users.findOne({
                    where: { email:profile.id, type: 'SOCIAL'}
                });

                // 카카오 가입이 되어 있다면
                if (exUser) {
                    done(null, exUser); // 로그인 인증 성공
                } else {
                    // 가입이되지 않은 유저라면 회원 가입시킨 후 로그인 시키기.
                    const newUser = await Users.create({
                        email:profile._json.kakao_account.email,
                        nickname : profile.displayName,
                        type:'SOCIAL',
                        role:'BASIC',
                        profileImg:profile.profile_image_url
                    });
                    done(null, newUser); // 회원가입하고 로그인 인증 완료
                }
            } catch(error) {
                console.error(error);
                done(error);
            }
        }
    ))
};

export default kakaoStrategy;