# Refactor (TODO)

추후 리팩토링을 위한 파일입니다. 배포 전 프로젝트와 관련된 리드미로 변경될 예정입니다. 
develop 브랜치에서 pull 받은 후 작업하면서 추가로 리팩토링 되어야 하는 부분들을 아래에 적어주세요!

## feature/1013

 - express-validator : req.body validation을 배열 형식이 아닌 다른 방식으로 업데이트 
 - 특이 에러 케이스에 대해서 다시 한번 에러 핸들링 체크 필요(mongoDB error)
 - services >> memoroom.getAllMemoRoom flatMap으로 리팩토링 혹은 별도 함수를 따로 만들어 관리

## feature/1020

 - aws s3 error handling : 관련 조사 추가 필요
 - services/memoRoom.js : forEach & deleteObject가 아닌 "deleteObjects"으로 다시 구현할 것 [관련 공식 문서](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property)

## feature/1018
 - chat 소켓 연결
 - chat 이라는 네임스페이스를 이용하여 해당 채팅만 해당하는 이벤트 관심사 분리를 하였음
 - 현재 소켓 on 이벤트 로직에 비즈니스 로직이 추가되어 있음
 - 채팅 소켓 통신 해당 채팅에 관한 고유한 아이디가 필요하므로 해당 db에 먼저 접근 후 통신을 하였습니다.