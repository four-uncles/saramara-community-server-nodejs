import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const secret = config.jwtSecret;

const jwtService = {
  sign: (userinfo) => {
    console.log(secret);
    const payload = {
      email: userinfo.email,
      role: userinfo.role,
    };

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
    return jwt.sign({}, secret, {
      algorithm: 'HS256',
      expiresIn: '14d',
      issuer: 'kshired',
    });
  },
  
  refreshVerify: async (token, username) => {
    const getAsync = promisify(redisClient.get).bind(redisClient);
    try {
      const data = await getAsync(username);
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