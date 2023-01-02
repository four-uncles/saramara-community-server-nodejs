import { Router } from 'express';
import users from './routes/users/index.js';
import posts from "./routes/posts.js";
import comments from "./routes/comments.js"

/**
 * routes 디렉토리의 API들을 모두 내보낸다.
 * users, posts, comments
 * 최상위의 index.js를 라우터로 등록하고 최상위 index.js 라우터 등록 함수를 하위 디렉토리나 파일 (하위 API 주소에 해당)으로 전달하고
 * 하위 파일을 라우터로 등록(Router)해서 그 라우터를 매개변수로 하여 함수를 호출하면 
 * /최상위/하위 형태의 API 라우터로 등록할 수 있다.
 */
export default () => {
	const app = Router();
	
	users(app);
    posts(app);
	comments(app);

	return app;
}