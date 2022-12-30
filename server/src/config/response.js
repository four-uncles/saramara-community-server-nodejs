/*
 * 응답 데이터 포맷 형식
 * Success - 200
 * Bad request - 400
 * Unauthorized(user dosen't exist, passward incorrect) - 401 
 * Conflict(user nickname already exist) - 409
 */

const responseData = {
  SUCCESS: { code: 200, msg: "success", data: {} },

  TOKEN_EMPTY: { code: 200, msg: "JWT 토큰을 입력해주세요.", data: {} },
  TOKEN_VERIFICATION_FAILURE: { code: 200, msg: "JWT 토큰 검증 실패", data: {} },
  TOKEN_VERIFICATION_SUCCESS: { code: 200, msg: "JWT 토큰 검증 성공", data: {} },

  // User Response
  NICKNAME_EMPTY: { isSuccess: false, code: 2000, message: '닉네임(Id)을 입력하세요.' },
  PASSWORD_EMPTY: { isSuccess: false, code: 2001, message: '비밀번호를 입력하세요.' },
  SIGNIN_NICKNAME_WRONG: { isSuccess: false, code: 2002, message: '존재하지 않는 닉네임입니다.' },
  PASSWORD_WRONG: { isSuccess: false, code: 2003, message: '비밀번호가 맞지 않습니다.' },
  SIGNUP_VERIFIEDPASSWORD_EMPTY: { isSuccess: false, code: 2004, message: '비밀번호 확인을 입력하세요.' },
  SIGNUP_NAME_EMPTY: { isSuccess: false, code: 2005, message: '이름을 입력하세요.' },
  SIGNUP_REDUNDANT_EMAIL: { isSuccess: false, code: 2006, message: '존재하는 닉네임(Id)입니다.' },
  UPDATE_ERROR_TYPE: { isSuccess: false, code: 2007, message: '잘못된 형식 입니다.' },

  // DB Error
  SERVER_CONNECT_ERROR: { isSuccess: false, code: 500, message: '서버 접속 에러입니다.' },

  // Profile Response
  LOGIN_ERROR: { isSuccess: false, code: 3000, message: '이용하려면 로그인 하세요' },
};
export default responseData;

// module.exports = {
//   SUCCESS: { code: 200, msg: "성공", data: {} },

//   TOKEN_EMPTY: { code: 200, msg: "JWT 토큰을 입력해주세요.", data: {} },
//   TOKEN_VERIFICATION_FAILURE: { code: 200, msg: "JWT 토큰 검증 실패", data: {} },
//   TOKEN_VERIFICATION_SUCCESS: { code: 200, msg: "JWT 토큰 검증 성공", data: {} },

//   // User Response
//   NICKNAME_EMPTY: { isSuccess: false, code: 2000, message: '닉네임(Id)을 입력하세요.' },
//   PASSWORD_EMPTY: { isSuccess: false, code: 2001, message: '비밀번호를 입력하세요.' },
//   SIGNIN_NICKNAME_WRONG: { isSuccess: false, code: 2002, message: '존재하지 않는 닉네임입니다.' },
//   PASSWORD_WRONG: { isSuccess: false, code: 2003, message: '비밀번호가 맞지 않습니다.' },
//   SIGNUP_VERIFIEDPASSWORD_EMPTY: { isSuccess: false, code: 2004, message: '비밀번호 확인을 입력하세요.' },
//   SIGNUP_NAME_EMPTY: { isSuccess: false, code: 2005, message: '이름을 입력하세요.' },
//   SIGNUP_REDUNDANT_EMAIL: { isSuccess: false, code: 2006, message: '존재하는 닉네임(Id)입니다.' },
//   UPDATE_ERROR_TYPE: { isSuccess: false, code: 2007, message: '잘못된 형식 입니다.' },

//   // DB Error
//   SERVER_CONNECT_ERROR: { isSuccess: false, code: 500, message: '서버 접속 에러입니다.' },

//   // Profile Response
//   LOGIN_ERROR: { isSuccess: false, code: 3000, message: '이용하려면 로그인 하세요' },
// };