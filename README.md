# Saramara Community Project
구매할 때 "이걸 사 말아?" 라는 고민들을 공유하고 추천받으며 구매와 관련된 고민들을 덜어낼 수 있는 커뮤니티입니다.

---

## 프로젝트 구조
```
src
│    App.js          # 애플리케이션의 Entry Point
└─── api             # 앱의 모든 경로에 대한 컨트롤러
└─── config          # 각종 환경변수 및 설정과 관련된 항목들의 집합
└─── loaders         # 앱을 시작하기 위한 작업들을 여러 모듈들로 분할하여 관리하는 디렉토리
└─── models          # DB와 매핑되는 각각의 모델
└─── services        # 모든 비즈니스 로직을 작성하는 디렉토리
```

<br>

> **App.js** <br>
node 서버 Express를 설정하고 Sequelize를 연결하고, CORS를 구성하고, 서버를 연결할 entry point입니다.

> **api** <br>
앱에서 접근하는 모든 경로들을 모아두는 디렉토리입니다.
> - routes dir: frontend에서 접근할 모든 경로에 대한 컨트롤러
> - middlewares dir: AOP 및 미들웨어로 사용하는 경로에 대한 컨트롤러

> **config** <br>
각종 환경변수 및 설정과 관련된 항목들을 정의하는 config.js가 존재합니다.

> **loaders** <br>
express와 sequelize, logger와 관련된 설정을 독립적으로 로드할 수 있도록 관리합니다.

> **models** <br>
Model(Database Table) 등의 테이블 구성을 모아두는 디렉토리입니다.

> **services** <br>
findOne, findAll, create, update, delete 등의 비즈니스 로직(CRUD)이 구현된 곳입니다.

<br>

## 요청 및 응답 객체
---
### status 200 - OK
```
{
  "code": 200,
  "msg": "success",
  "data": responseData 
}
```
### status 400 - Bad request
```
{
  "code": 400,
  "msg": "err message",
}
```

### status 401 - Unauthorized(user dosen't exist, passward incorrect)
```
{
  "code": 401,
  "msg": "err message",
}
```
### status 409 - Conflict(user nickname already exist)
```
{
  "code": 409,
  "msg": "err message",
}
```

<br>

## API 설계서
자세한 API 설계 내용은 [노션 링크](https://jooneys-portfolio.notion.site/API-e98486d3b7bd4b3189bfdcb388fef807)에서 확인할 수 있습니다.


<br>

## React(클라이언트) - Node(서버) 프로젝트 세팅
---

### 1.  server 디렉토리에서 서버 기본틀에 필요한 패키지들을 설치한다.
> yarn add express morgan path multer fs util mime ejs dotenv nodemon sequelize mysql mysql2 express-session express-mysql-session cors winston cookie-parser body-parser nunjucks bcrypt jsonwebtoken passport dayjs uuid


<br>

### 2. React와 Node를 동시에 실행시키기 위해 concurrently 패키지 설치한다.
> yarn add -D concurrently

<br>

### 3. server 디렉토리에서 node 개발 환경 설정을 진행한다.
> npm init
> 패키지 설정은 기본값으로 그대로 진행
> node_modules 디렉토리 생성여부를 확인한다.

<br>

### 4. cliet 디렉토리에서 react 개발 환경 설정을 진행한다.
> npm init
> 패키지 설정은 기본값으로 그대로 진행
> node_modules 디렉토리 생성여부를 확인한다.

<br>

### 5. Node와 React를 동시에 실행할 수 있는 명렁어들을 각각 확인한다.

#### 5.1 root 디렉토리에서 react 실행
> yarn run client

#### 5.2 root 디렉토리에서 node 서버 실행
> yarn run server

#### 5.3 root 디렉토리에서 reat와 node 동시 실행 
> yarn run dev

<br><br>

## 협업 절차[Github flow]
---

### 1. 원격에서 로컬로 받아오기
```
git clone 주소 복붙
```

### 2. main에 종속된 기능브랜치 생성
```
git checkout -b 생성할브랜치명 종속될브랜치
```
```
ex) `git checkout -b fe/docs/readme main
```

<br>

#### 여기서 발생할 수 있는 문제상황은?
> main에 종속된 기능 branch에서 작업 후 PR하려는데, 다른 팀원이 먼저 PR 후 merge까지해서 main이 업데이트된 상황이 발생할 수 있다.

<br>

### 1. 생성한 브랜치(fe/docs/readme)에서 작업 끝나면 commit 하기
```
git add .
git commit -m "커밋명"
```

### 2. 업데이트된 원격을 로컬에서도 동기화하기
로컬에서 main branch(중심브랜치)로 checkout하고 원격 main에서 업데이트된 작업을 로컬에 pull 받아서 업데이트한다.

```
git switch main
git pull origin main
```

### 3. 원격 main이랑 동기화된 로컬 main에서 생성한 브랜치로 rebase하기
```
git rebase main 생성한브랜치
```

#### 서로 파일 겹쳐서 충돌(conflict)이 발생했을 경우
conflict 해결 후 rebase 이어서 진행하면 된다.
```
git rebase --continue
```

### 4. rebase 끝나면 원격에 생성한브랜치 push 하기

```
git push orign fe/docs/readme
```

<br><br>

### 참고
- React와 Node를 동시에 실행을 위해 최상위 폴더의 package.json 의 script 속성은 아래와 같이 수정되어 있다.

```json
    "scripts": {
    "client": "cd client && yarn start",
    "server": "cd server && nodemon app.js",
    "dev": "concurrently --kill-others-on-fail \"yarn run server\" \"yarn run client\""
  }
```
