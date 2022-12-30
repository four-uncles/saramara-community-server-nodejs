import { Router } from 'express';
import users from "./routes/users.js";
import posts from "./routes/posts.js";
import comments from "./routes/comments.js"

/* 
 * routes 디렉토리의 API들을 모두 내보낸다.
 * users, posts, comments
 */
export default () => {
	const app = Router();

	users(app);
    posts(app);
	comments(app);

	return app
}