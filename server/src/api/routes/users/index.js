import { Router } from 'express';
import register from './register.js'
import login from './login.js'
import refresh from './refresh.js';

/* 
 * users 디렉토리의 API들을 모두 내보낸다.
 * join, login, refresh, ...
 */
export default (app) => { // Router() 함수를 매개변수로 받는다
	// Router() 함수를 각각의 실제 라우터로 등록하는 로직이 있는 라우터 파일로 넘겨줘서 등록한다.
	
	refresh(app);
    register(app); 
	login(app);

	return app
}