/* 
 * api/refresh router
 */
import { Router } from "express";
import jwtService from '../../../services/jwtService.js'
import Users from '../../../models/users.js'
import jwt from 'jsonwebtoken'



const router = Router();

const refresh = (app) => {
  app.use('/users', router);
  router.post('/refresh', async (req, res, next) => {
    try {

      console.log(req.headers.authorization.split('Bearer ')[1]);
      console.log(req.headers.refresh);
      // Client 에 access, refresh token 이 있는지 먼저 확인한다.
      if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        

        // access token verify
        const authResult = jwtService.verify(authToken);

        // access token decoding
        const decoded = jwt.decode(authToken);

        if (decoded === null) {
          res.status(401).send({
            ok: false,
            message: 'No authorized!',
          });
        }

        // refreshToken verify

        const email = decoded.email

        let userinfo = null;
        try {
          userinfo = await Users.findOne({
            where: {
              email: email,
            },
          });
        } catch (err) {
          res.status(401).send({
            ok: false,
            message: err.message,
          });
        }
        
        const refreshResult = jwtService.refreshVerify(refreshToken, email);

        if (authResult.ok === false && authResult.message === 'jwt expired') {
          // 1. accessToken expired && refreshToken expired => make user login
          if (refreshResult.ok === false) {
            res.status(401).send({
              ok: false,
              message: 'No authorized!',
            });
          } else {
            // 2. accessToken expired && refreshToken valid => make new accessToken
            const newAccessToken = jwtService.sign(user);

            res.status(200).send({
              ok: true,
              data: {
                accessToken: newAccessToken,
                refreshToken,
              },
            });
          }
        } else {
          // 3. accessToken valid => dont have to make new token
          res.status(400).send({
            ok: false,
            message: 'Acess token is not expired!',
          });
        }
      } else {
        res.status(400).send({
          ok: false,
          message: 'Access token and refresh token are need for refresh!',
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
}
export default refresh;

/* const refresh = async (req, res) => {
  // check access token and refresh token exist
  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh;

    // access token verify
    const authResult = verify(authToken);

    // access token decoding
    const decoded = jwt.decode(authToken);

    if (decoded === null) {
      res.status(401).send({
        ok: false,
        message: 'No authorized!',
      });
    }

    // refreshToken verify
    let userinfo = null;
    try {
      userinfo = await Users.findOne({
        where: {
          email: decoded.email,
        },
      });
    } catch (err) {
      res.status(401).send({
        ok: false,
        message: err.message,
      });
    }

    const refreshResult = refreshVerify(refreshToken, userinfo.email);

    if (authResult.ok === false && authResult.message === 'jwt expired') {
      // 1. accessToken expired && refreshToken expired => make user login
      if (refreshResult.ok === false) {
        res.status(401).send({
          ok: false,
          message: 'No authorized!',
        });
      } else {
        // 2. accessToken expired && refreshToken valid => make new accessToken
        const newAccessToken = sign(user);

        res.status(200).send({
          ok: true,
          data: {
            accessToken: newAccessToken,
            refreshToken,
          },
        });
      }
    } else {
      // 3. accessToken valid => dont have to make new token
      res.status(400).send({
        ok: false,
        message: 'Acess token is not expired!',
      });
    }
  } else {
    res.status(400).send({
      ok: false,
      message: 'Access token and refresh token are need for refresh!',
    });
  }
};

module.exports = refresh; */