import syncDir from "./syncDir.js";
import fileUpload from "./fileUpload.js";

/** 
 * middlewares 디렉토리의 API들을 모두 내보낸다.
 * auth(인증 및 인가 관련), attachs(첨부파일)
 */
export default {
	syncDir,
	fileUpload
};