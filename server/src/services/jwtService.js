import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import Tokens from '../models/tokens.js'

const secret = config.jwtSecret;

const jwtService = {
  // 입력 받은 userinfo 중 email과 role 로 payload 생성
  sign: (userinfo) => {
    const payload = {
      userId: userinfo.userId,
      email: userinfo.email,
      role: userinfo.role,
    };

    // payload, 해독키, 해싱 알고리즘, 만료기간, 발급자로 만든 jwt 반환
    return jwt.sign(payload, secret, {
      algorithm: config.jwtAlgorithm,
      expiresIn: config.jwtAccessTokenExpiresIn,
      issuer: config.jwtIssuer,
    });
  },

  verify: (token) => {;
    try {
      const decoded = jwt.verify(token, secret);
      console.log(decoded);
      return {
        ok: true,
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },

  // refresh 토큰을 redis 혹은 nginx 를 docker에 띄워서 사용하려 했으나 문제를 해결하지 못해
  // DB 의 Session 보다는 DB 테이블로 따로 관리하는 것이 더 효율적이라고 생각해서 따로 관리
  // express-session에 너무 많은 키를 가지고 있으면 성능 저하 우려.
  refresh: async(userinfo) => {

    const countRefreshToken = await Tokens.count({
      where: {
        email: userinfo.email
      }
    });

    // DB에 같은 사용자 클라이언트에 대한 refresh token이 추가되는 것을 방지
    if(countRefreshToken === 0){
      const payload = {
        email: userinfo.email,
        role: userinfo.role,
      };
      await Tokens.create({
        // sing 함수에게 반환 받은  jwt에 다시 jwt 암호화 키와 알고리즘, 만료기간, 발급자 를 암호화해서 refrsesh token 생성해서 반환
        refreshToken: jwt.sign(payload, secret, {
          algorithm: config.jwtAlgorithm,
          expiresIn: config.jwtRefreshTokenExpiresIn,
          issuer: config.jwtIssuer,
        }),
        email: userinfo.email,
      });

      const result = await Tokens.findOne({
        where:{
          email: userinfo.email
        }
      });
      //console.log(result.refreshToken);
      return result.refreshToken;
    }
    else if(countRefreshToken === 1){

      const result = await Tokens.findOne({
        where:{
          email: userinfo.email
        }
      });
      
      /* try {
        jwt.verify(result.refreshToken, secret)
      } catch (error) {
        err
      } */

      return result.refreshToken;
    }
  },
  
  refreshVerify: async (token, email) => {
    // DB에 일치하는 RefreshToken 있는지 검사
    const getRefreshToken = await Tokens.findOne({
      where: {
        email: email
      }
    });

    try {
      jwt.verify(token, secret);
      const data = await getRefreshToken.refreshToken;
      try {
        if (token === data) {
          return true;
        } 
        else {
          return false;
        }
      } catch (err) {
        console.log(err)
        
        if(err){
          return false;
        }
      }
      
    } catch (err) {
      // refresh 만료
      return false;
    }
  }

}

export default jwtService;   