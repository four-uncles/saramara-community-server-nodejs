/* 
 * api/refresh router
 */
import { Router } from "express";
import jwtService from '../../../services/jwtService.js'
import Users from '../../../models/users.js'
import jwt from 'jsonwebtoken'
import { constants } from "fs/promises";



const router = Router();

const refresh = (app) => {
  app.use('/users', router);
  router.post('/refresh', async (req, res, next) => {
    try {
      // Client 에서 access, refresh token 이 있는지 먼저 확인한다.
      if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;    


        // access token 확인 진행
        const authResultAcc = jwtService.verify(authToken);
        //console.log(authToken)
        //console.log(authResult.ok)

        // access token 디코딩
        const decoded = jwt.decode(authToken);


        // 디코딩 된 값이 없거나 디코딩된 값의 요소중 email이 없다면 유효하지 않은것으로 간주하고 에러메시지 응답하고 예외 발생처리
        if (decoded === null) {
          
          res.status(401).send({
            ok: false,
            message: 'No authorized!',
            case: "wrong access token"
          });
        }

        // refreshToken 검증, decoded.email 인 경우 예외발생
        const email = decoded.email

        try {
          // 엑세스 토큰이 만료되었을 때
          if (authResultAcc.ok === false && authResultAcc.message === 'jwt expired') {
            
            // 리프레쉬 토큰에 대한 유효성 검사를 진행
            const authResultRefresh = async(refreshToken, email) => jwtService.refreshVerify(refreshToken, email);
            const authResultRef = await authResultRefresh(refreshToken, email)

            // 리프레쉬 토큰이 만료되었을 경우
            if (authResultRef === false) {// 리프레쉬 토큰이 만료되었을 경우
              console.log(authResultRef)
              // access token, refresh token 이 모두 만료 되었을 때 의 경우
              res.status(401).send({
                ok: false,
                message: 'No authorized!',
                case: "access & refresh expire!"
              });

            } else {// 리프레쉬 토큰이 만료되지 않았을 경우

              // access token이 만료되었지만 refresh token이 유효하다면 access token을 재발급한다.
              // access token이 만료 되었지만  refresh가 유효한 경우에 access 를 다시 발급하기 위한 sign 함수를 위해 사용자 정보를 불러온다.
              const userinfo = await Users.findOne({
                where: {
                  email: email,
                }
              });
              
              const newAccessToken = jwtService.sign(userinfo);
              res.status(200).send({
                ok: true,
                data: {
                  accessToken: newAccessToken,
                  refreshToken,
                  case: "access expire & refresh valid"
                }
              });
            }
          } else {
            // access token 이 만료되지 않은 경우
            res.status(400).send({
              ok: false,
              message: 'Acess token is not expired!',
              case: 'access is valid'
            });

          }
        } catch (err) {
          // access token 자체가 만료 여부와 상관없이 유효하지 않은 token 일때
          res.status(401).send({
            ok: false,
            message: err.message,
            case: "invalid token"
          });
        }

      } else {
        res.status(400).send({
          ok: false,
          message: 'Access token and refresh token are need for refresh!',
          case: "client not post token"
        });
      }
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        message: "wrong approach",
        case: "unknown"
      }
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