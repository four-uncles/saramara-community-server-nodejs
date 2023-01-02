import { Router } from 'express';
import attachs from './attachs.js';

/** 
 * util 디렉토리의 API들을 모두 내보낸다.
 * attachs(첨부파일)
 */
export default () => {
	const app = Router();

	attachs(app);

	return app;
}