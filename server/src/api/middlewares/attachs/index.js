import syncDir from "./syncDir.js";
import fileUpload from "./fileUpload.js";

/** 
 * middlewares/attachs 디렉토리의 함수를 모두 내보낸다.
 * syncDir(첨부파일 디렉토리 세팅), fileUpload(첨부파일 업로드)
 */
export default {
	syncDir,
	fileUpload
};