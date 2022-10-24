const jwt = require("jsonwebtoken");

const secretKey = "my secret key!";

const token = jwt.sign(
    { userIdx: 100, nickname: "김철수" }, // payload 정의
    secretKey // 서버 비밀키
);

console.log(token);

const verifiedToken = jwt.verify(token, secretKey);

console.log(verifiedToken);
