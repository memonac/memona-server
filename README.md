# **🍋 MEMONA-C**

<img src="./readme.asset/intro.png" width="1000px" alt="intro">
<br>
<br>
쌓여가는 포스트잇에 내가 뭘 적었고, 어디에 붙여놨는지 기억이 안났던 경험이 있지 않나요?<br>
적어둔 메모들을 팀원들과 공유하면 좋겠다... 라는 생각을 해본 적 없으신가요?<br>

그럴 땐, 🍋 **Memona-C** 🍋 를 이용해보세요<br>
**실시간**으로 팀원들과 **메모를 공유**할 수 있고, **채팅**을 통해 의견을 나눌 수 있습니다!

#### 🔗 **[MEMONA-C](https://www.memona-c.com/)**

<br>
<br>
<br>

# **📽 사용 영상**

아래의 이미지를 눌러주세요 !

<br>

[![시연 영상](https://img.youtube.com/vi/0LNWE4fIXso/0.jpg)](https://www.youtube.com/watch?v=0LNWE4fIXso)


<br>
<br>
<br>

# **💡 동기**
팀원 모두가 평소 메모를 많이 하는 편인데, 쌓여가는 포스트잇과 작성한 메모들을 공유하기 어려워 뭔가 더 편리한 방법이 없을까? 라는 생각으로 프로젝트를 시작했습니다.<br>
 하루 10시간 이상을 컴퓨터를 사용하기 때문에 웹에 메모지를 붙이는 기능이 있었으면 좋겠다 싶었고, 나아가 이를 공유할 수 있다면 편리할 것 같아 아이디어를 발전시켜 협업 메모툴을 만들기로 결정했습니다.
<br>
<br>
<br>
# **🗓 프로젝트 기간**
- **계획단계 2022.01.24 ~ 01.28**
  - 01.24 : 아이디어 및 기술스택 선정
  - 01.25 : mockup, schema 세팅
  - 01.26 : 전체 작업내용 task 별도 정리
  - 01.27 : task 정리 완료
  - 01.28 : git repository 생성
- **개발단계 2022.02.03 ~ 02.18**
  - 02.03 : 초기 세팅 (client, back 폴더구조 및 기본 세팅)
  - 02.04 : firebase 기반 로그인, 로그아웃, 회원가입 프론트엔드, 백엔드 작업
  - 02.05 ~ 02.06 : 메인페이지 내 CRUD 작업 및 태그 검색 기능 추가
  - 02.07 : socket.io, redux-saga 기초 세팅
  - 02.08 ~ 02.09 : 메모룸 프론트 작업
  - 02.11 ~ 02.15 : 메모 CRUD 및 메모룸 내 채팅기능 구현, socket 연결
  - 02.16 ~ 02.18 : 코드 리팩토링 및 배포, 테스트 코드 작성
<br>
<br>
<br>

# **🔨 기술 스택**

<img src="./readme.asset/techSpec.png" width="1000px" alt="intro">

<br>
<br>
<br>

# **📝 실행 방법**
## **Client**

```
https://github.com/memonac/memonac-client.git
npm install 
npm start
```
<br>

## **Server**
```
https://github.com/memonac/memonac-server.git
npm install
npm start // npm run dev (development 버전)
```

<br>
<br>
<br>

# **🔐 환경변수 설정 부분**

### **Client 폴더 최상단에 .env 파일을 생성한 후 아래의 정보를 넣어주세요**

```
REACT_APP_FIREBASE_AUTHDOMAIN=<YOUR_FIREBASE_AUTHDOMAIN>
REACT_APP_FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
REACT_APP_FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
REACT_APP_FIREBASE_MESSAGING_SENDERID=<YOUR_FIREBASE_MESSAGING_SENDERID>
REACT_APP_FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
REACT_APP_FIREBASE_MEASUREMENT_ID=<YOUR_FIREBASE_MEASUREMENT_ID>
REACT_APP_SERVER_URI=http://localhost:8000
```
<br>

### **Server 폴더 최상단에 .env 파일을 생성한 후 아래의 정보를 넣어주세요**
```
DB_ATLAS=<YOUR_MONGODB_URI>
CLIENT=http://localhost:3000

SECRET_KEY=<YOUR_JWT_TOKEN_SECRET_KEY>
FIREBASE_APIKEY=<YOUR_FIREBASE_APIKEY>
FIREBASE_AUTHDOMAIN=<YOUR_FIREBASE_AUTHDOMAIN>
FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
FIREBASE_MESSAGING_SENDERID=<YOUR_FIREBASE_MESSAGING_SENDERID>
FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
FIREBASE_MEASUREMENT_ID=<YOUR_FIREBASE_MEASUREMENT_ID>

GOOGLE_MAIL=<YOUR_EMAIL>
GOOGLE_PASSWORD=<YOUR_APP_PASSWORD>
GOOGLE_PORT=<GOOGLE_PORT>
INVITE_URL=<URL>
NODEMAILER_HOST=<GOOGLE_SERVER>
NODEMAILER_SERVER=<GMAIL>

AWS_BUCKET_REGION=<YOUR_AWS_S3_BUCKET_REGION>
AWS_BUCKET_IDENTITY_POOL_ID=<YOUR_AWS_S3_IDENTITY_POOL_ID>
AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY>
AWS_SECRET_KEY=<YOUR_AWS_SECRET_KEY>
AWS_BUCKET_NAME=<YOUR_AWS_S3_BUCKET_NAME>
```
<br>
<br>
<br>

# **🔬 기능**

- **회원가입 및 로그인**
    - Firebasae AUTH를 통해, 소셜(구글) 및 이메일주소 & 비밀번호 로그인, 회원가입이 가능합니다.
- **메모 메인페이지**
    - 로그인한 유저가 참여중인 메모룸이 리스트로 보여집니다.
    - 메모룸은 메인페이지 내 NEW 버튼을 통해 생성 가능합니다.
    - 삭제 및 메모룸 이름 수정은 개별 메모룸 리스트 내 상단에 위치한 햄버거 버튼 클릭시 가능합니다.
        - 해당 메모룸을 생성한 유저만 메모룸을 삭제할 수 있습니다.
    - 왼쪽 사이드바에는 본인이 참여한 모든 메모룸들의 태그가 나열되며, 태그 검색을 통해 원하는 메모룸을 찾을 수 있습니다.
- **메모룸 상세 페이지**
    - 새 메모 추가 기능
        - NEW 버튼을 누르면 메모 생성과 관련된 화면이 나타납니다.
        - Text, Image, Voice 총 3가지의 타입, 새 메모 색상, 태그들을 입력할 수 있습니다.
    - 메모 수정 및 삭제 기능
        - 메모의 색상, 태그, 크기, 위치를 수정할 수 있으며, 수정되거나 삭제된 메모는 실시간 통신을 이용해 메모 협업 공간에 참여한 모든 사람들의 메모룸에 반영됩니다.
    - 메모룸 초대 기능
        - 메모룸 내 SEND 버튼을 통해 초대 메일을 발송할 수 있으며, 초대 받은 사람은 메일의 링크를 통해 해당 메모룸에 입장할 수 있습니다. (단, 이 서비스에 가입된 사용자에 한합니다.)
    - 메모룸 나가기 기능
        - 메모룸 내 LEAVE 버튼을 통해 참여중인 메모룸을 나갈 수 있습니다. (메모룸의 owner는 나갈 수 없습니다)
        - 메모룸을 나가게 되면, 현재 참여하고 있는 메모룸 리스트에서 삭제됩니다.
    - 채팅 기능
        - CHAT OPEN 버튼을 통해 이 방에 참여하고 있는 사용자는 실시간으로 채팅할 수 있습니다.
        - 채팅한 내용은 해당 메모룸에 들어와있지 않았던 참여자에게도 보여집니다.
    - 참여자 렌더링
        - 오른쪽 상단에 메모룸에 참여하고 있는 사람들을 볼 수 있습니다.
<br>
<br>
<br>

# **🤔 이슈 & 고민되었던 부분**
**1. Socket & DB 통신**
<br>
<br>
<img src="./readme.asset/axios1.png" width="1000px" alt="axios1">
<br>
<img src="./readme.asset/axios2.png" width="1000px" alt="axios2">
<br>
<br>
**2. AWS S3 로직 처리 위치** : 왜 aws s3를 프론트가 아닌 서버에서 진행하게 되었는가
<br>
<br>
메모 수정 시, 이미지/음성파일을 업로드하는 과정에서 AWS-S3를 사용하여 구현하기로 결정하였습니다.
초반에는 이미지, 음성의 용량이 큰 경우 서버로 전달하는 과정에서 과부하가 우려되어 서버리스로 프론트엔드에서 관련 로직을 구현하는 방향으로 진행하게 되었습니다. 하지만, 프론트엔드에서 처리하게 되는 경우, 백엔드에서 저장하는 과정에서 에러가 발생하게 되면, 대처하기 어려운 부분이 있었기 때문에 이에 따라 어디에서 구현하는 것이 더 적합한지에 대해 고민하게 되어 아래와 같이 정리해볼 수 있었습니다.
1) 프론트엔드에서 aws s3 처리를 하게 된다면?
- 장점:
  - 서버리스로 파일을 저장하기 때문에 서버를 조금더 효율적으로 쓸 수 있음.
  - 애초에 전달되는 정보가 매우 가볍고, 대용량의 정보가 전달되는 경로가 짧음.
- 단점:
  - 프론트에서 미리 저장을 하고 서버로 넘어왔을 때, 에러가 발생하게 된다면 그것을 삭제해주는 로직이 또 필요함. (비효율적)
  - 브라우저에 관련 정보는 노출되면 안되지만, 프론트엔드에서 로직을 구현하게 된다면 이로 인해 보안성이 취약해지고 외부에서 해당 버킷에 다른 정보들을 업로드할 가능성이 생김.
  - 이미지 파일도 종류에 따라 저장방법이 다를 수 있는데, 일괄적으로 저장하게 되면 섬세한 데이터 핸들링이 어려울 수 있음.
2) 백엔드에서 aws s3 처리를 하게 된다면?
- 장점:
  - 저장하면서 서버에서 오류가 나게 된다면, AWS-S3에는 저장이 되지 않고 에러 핸들링을 할 수 있음.
  - AWS-S3 업로드와 관련된 로직들에 대해 대처를 유연하게 할 수 있기 때문에 업로드를 다시 시도하는 동안, 브라우저에서는 다른 작업들을 진행할 수 있음.
- 단점:
  - 직접적인 DB 경로가 길어지기 때문에, 관련 정보를 처리하는 것이 비효율적일 수 있음.
  - 수많은 클라이언트에서 한개의 서버에 대용량의 수많은 파일들을 한번에 처리해야 하는 순간이 오게 된다면, 서버에서 빠르게 대응하기 어려울 수 있음.

<br>
위와 같이 정리했을 때, 프론트엔드에서 용량과 관련된 이슈가 발생하게 된다면, 용량 제한을 사용하여 서버 과부하에 대한 우려를 줄일 수 있을 것이고, 서버와 클라이언트간의 데이터 왕복이 서버를 다운시킬 만큼 많지 않을 것이라고 생각했습니다. 또한, 데이터 처리와 관련된 에러 핸들링이 조금 더 섬세하게 보완하는 것과 보안성 이슈에 더 초점을 두어 백엔드에서 AWS-S3 관련 로직을 구현하는 것으로 결정하였습니다.
<br>
<br>

**3. 초대 메일 인증 처리**
<br>
<br>
<img src="./readme.asset/nodemailer.png" width="1000px" alt="nodemailer">
<br>
<br>
<br>

# **🔧 보완해야 하는 부분**

<img src="./readme.asset/improvement.png" width="1000px" alt="improvement">
<br>
<img src="./readme.asset/improvement2.png" width="1000px" alt="improvement2">
<br>
<br>
<br>

# **🎤 소감**

<img src="./readme.asset/review.png" width="1000px" alt="review">
<br>
<br>
<br>
