import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import Tokens from '../models/tokens.js'

const secret = config.jwtSecret;

const jwtService = {
  // 입력 받은 userinfo 중 email과 role 로 payload 생성
  sign: (userinfo) => {
    const payload = {
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

  verify: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return {
        ok: true,
        id: decoded.id,
        role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },

  refresh: () => {
    // sing 함수에게 반환 받은  jwt에 다시 jwt 암호화 키와 알고리즘, 만료기간, 발급자 를 암호화해서 refrsesh token 생성해서 반환
    return jwt.sign({}, secret, {
      algorithm: config.jwtAlgorithm,
      expiresIn: config.jwtAccessTokenExpiresIn,
      issuer: config.jwtIssuer,
    });
  },
  
  refreshVerify: async (token, email) => {
    const getRefreshToken = await Tokens.findOne({
      where: {
        email: email
      }
    });
    console.log(email);
    console.log(getRefreshToken);
    // const getAsync = promisify(redisClient.get).bind(redisClient);
    try {
      const data = await getRefreshToken.refreshToken;
      if (token === data) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
        };
      }
    } catch (err) {
      return {
        ok: false,
      };
    }
  }

}

export default jwtService;   