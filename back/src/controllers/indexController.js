const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");

const indexDao = require("../dao/indexDao");
const { jwtsecret } = require("../../config/secret");

exports.readJwt = async function (req, res) {
    console.log("req => ", req);
    const { userIdx, nickname } = req.verifiedToken;

    return res.send({
        result: { userIdx: userIdx, nickname: nickname },
        code: 200,
        message: "유효한 토큰입니다.",
    });
};

// 학생들 테이블 조회
exports.readStudents = async function (req, res) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.selectStudents(connection);

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(`readStudents Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `readStudents DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

exports.readRestaurants = async function (req, res) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.selectRestaurants(connection);

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200,
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(
                `readRestaurants Query error\n: ${JSON.stringify(err)}`
            );
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `readRestaurants DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

exports.readUsers = async function (req, res) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.selectUsers(connection);

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200,
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(`readUsers Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(`readUsers DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

// 특정 학생 테이블 조회
exports.readStudent = async function (req, res) {
    const { studentId } = req.params;
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.selectStudent(connection, studentId);

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(`readStudent Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `readStudent DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

exports.readRestaurant = async function (req, res) {
    const { restaurantId } = req.params;
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.selectRestaurant(
                connection,
                restaurantId
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(
                `readrRestaurant Query error\n: ${JSON.stringify(err)}`
            );
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `readRestaurant DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

exports.readUser = async function (req, res) {
    const { userId } = req.params;
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.selectUser(connection, userId);

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(`readUser Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(`readUser DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.readRestaurantByCategory = async function (req, res) {
    // [참고] ...?category=한식 이런식으로 넘어오면 req.query 로 값을 받는다.
    // ex) const { category } = req.query;
    const { category } = req.params;
    // 유효한 카테고리 인지 체크
    if (category) {
        const validCategory = [
            "한식",
            "중식",
            "일식",
            "양식",
            "분식",
            "구이",
            "회/초밥",
            "기타",
        ];
        if (!validCategory.includes(category)) {
            return res.send({
                isSuccess: false,
                code: 400, // 요청 실패시 400번대 코드
                message: "유효한 카테고리가 아닙니다.",
            });
        }
    }
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.selectRestaurantByCategory(
                connection,
                category
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(
                `readRestaurantByCategory Query error\n: ${JSON.stringify(err)}`
            );
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `readRestaurantByCategory DB Connection error\n: ${JSON.stringify(
                err
            )}`
        );
        return false;
    }
};

// 학생 추가
exports.createStudent = async function (req, res) {
    const { name, major, birth, address } = req.body;
    // 값 체크
    // name, major, address: 문자타입
    if (
        typeof name !== "string" ||
        typeof major !== "string" ||
        typeof address !== "string"
    ) {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "값을 정확히 입력해주세요.",
        });
    }
    // birth: 날짜타입
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (!regex.test(birth)) {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "생일을 정확히 입력해주세요.",
        });
    }
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.insertStudent(
                connection,
                name,
                major,
                birth,
                address
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(`createStudent Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `createStudent DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

exports.createUser = async function (req, res) {
    const { userId, password, nickname } = req.body;

    const userIdRegExp = /^[a-z]+[a-z0-9]{5,19}$/; // 영문시작 + 영문 혹은 숫자 5~19자
    const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/; // 8~16 문자, 숫자 조합
    const nicknameRegExp = /^[가-힣|a-z|A-Z|0-9|]{2,10}$/; // 2~10 한글, 숫자, 또는 영문

    if (!userIdRegExp.test(userId)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message:
                "아이디는 영문자로 시작하는 영문자 또는 숫자 6~20자여야 합니다.",
        });
    }
    if (!passwordRegExp.test(password)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "패스워드는 8~16 문자, 숫자 조합 입니다.",
        });
    }
    if (!nicknameRegExp.test(nickname)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "닉네임은 2~10 한글, 숫자, 또는 영문 이어야 합니다.",
        });
    }

    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // 아이디 중복검사
        const [user] = await indexDao.selectUser(connection, userId);
        console.log("user => ", user);

        if (user.length) {
            return res.send({
                isSuccess: false,
                code: 400,
                message: "존재하는 아이디 입니다.",
            });
        }

        // DB 입력
        const [rows] = await indexDao.insertUser(
            connection,
            nickname,
            userId,
            password
        );

        // 입력된 유저 인덱스
        const userIdx = rows.insertId; // 실제 DB에 자동증가로 입력되는 값

        // jwt 발급
        const token = jwt.sign(
            { userIdx: userIdx, nickname: nickname },
            secret.jwtsecret
        );

        return res.send({
            result: { jwt: token },
            isSuccess: true,
            code: 200, // 요청 실패시 400번대 코드
            message: "회원가입 성공",
        });
    } catch (err) {
        console.error(err);
    }
};

exports.createJwt = async function (req, res) {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원정보를 모두 입력해주세요.",
        });
    }

    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // 아이디와 비밀번호로 회원검증
        const [user] = await indexDao.isValidUser(connection, userId, password);
        if (!user.length) {
            return res.send({
                isSuccess: false,
                code: 410,
                message: "존재하지 않는 회원 입니다.",
            });
        }

        // 실제 서비스 에서는 userIdx는 일련번호이기 때문에 숨겨야함!
        const { userIdx, nickname } = user[0];

        // jwt 발급
        const token = jwt.sign(
            { userIdx: userIdx, nickname: nickname },
            secret.jwtsecret
        );

        return res.send({
            result: { jwt: token },
            isSuccess: true,
            code: 200, // 요청 실패시 400번대 코드
            message: "로그인 성공",
        });
    } catch (err) {
        console.error(err);
    }
};

exports.createRestaurant = async function (req, res) {
    const { title, address, videoUrl, category } = req.body;
    // 값 체크
    // title, address, videoUrl, category: 문자타입
    if (
        typeof title !== "string" ||
        typeof address !== "string" ||
        typeof videoUrl !== "string" ||
        typeof category !== "string"
    ) {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "값을 정확히 입력해주세요.",
        });
    }
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.insertRestaurant(
                connection,
                title,
                address,
                videoUrl,
                category
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(
                `createRestaurant Query error\n: ${JSON.stringify(err)}`
            );
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `createRestaurant DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

// 학생 수정
exports.editStudent = async function (req, res) {
    const { studentId } = req.params;
    const { name, major, birth, address } = req.body;
    // 값 체크
    // name, major, address: 문자타입
    if (name && typeof name !== "string") {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "이름을 정확히 입력해주세요.",
        });
    }
    if (major && typeof major !== "string") {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "전공을 정확히 입력해주세요.",
        });
    }
    if (address && typeof address !== "string") {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "주소를 정확히 입력해주세요.",
        });
    }
    // birth: 날짜타입 체크
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (birth && !regex.test(birth)) {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "생일을 정확히 입력해주세요.",
        });
    }
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            // 유효한 아이디인지 체크
            const isValidStudentId = await indexDao.isValidStudentId(
                connection,
                studentId
            );
            if (!isValidStudentId) {
                return res.send({
                    isSuccess: false,
                    code: 410,
                    message: "없는 학생아이디 입니다.",
                });
            }

            const [rows] = await indexDao.updateStudent(
                connection,
                name,
                major,
                birth,
                address,
                studentId
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "학생 정보수정 성공",
            });
        } catch (err) {
            logger.error(`updateStudent Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `updateStudent DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

exports.editRestaurant = async function (req, res) {
    const { restaurantId } = req.params;
    const { title, address, videoUrl, category } = req.body;
    // 값 체크
    // title, address, videoUrl, category: 문자타입
    if (title && typeof title !== "string") {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "제목을 정확히 입력해주세요.",
        });
    }
    if (address && typeof address !== "string") {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "주소를 정확히 입력해주세요.",
        });
    }
    if (videoUrl && typeof videoUrl !== "string") {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "비디오 주소를 정확히 입력해주세요.",
        });
    }
    if (category && typeof category !== "string") {
        return res.send({
            idSuccess: false,
            code: 400, // 요청 실패시 400번대 코드
            message: "카테고리를 정확히 입력해주세요.",
        });
    }
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            // 유효한 아이디인지 체크
            const isValidRestaurantId = await indexDao.isValidRestaurantId(
                connection,
                restaurantId
            );
            if (!isValidRestaurantId) {
                return res.send({
                    isSuccess: false,
                    code: 410,
                    message: "없는 식당 입니다.",
                });
            }

            const [rows] = await indexDao.updateRestaurant(
                connection,
                title,
                address,
                videoUrl,
                category,
                restaurantId
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "식당 정보수정 성공",
            });
        } catch (err) {
            logger.error(
                `updateRestaurant Query error\n: ${JSON.stringify(err)}`
            );
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `updateRestaurant DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

// 학생 삭제
exports.deleteStudent = async function (req, res) {
    const { studentId } = req.params;
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            // 유효한 아이디인지 체크
            const isValidStudentId = await indexDao.isValidStudentId(
                connection,
                studentId
            );
            if (!isValidStudentId) {
                return res.send({
                    isSuccess: false,
                    code: 410,
                    message: "없는 학생아이디 입니다.",
                });
            }

            const [rows] = await indexDao.deleteStudent(connection, studentId);

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200,
                message: "학생 삭제 성공",
            });
        } catch (err) {
            logger.error(`deleteStudent Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `deleteStudent DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};

exports.deleteRestaurant = async function (req, res) {
    const { restaurantId } = req.params;
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            // 유효한 아이디인지 체크
            const isValidRestaurantId = await indexDao.isValidRestaurantId(
                connection,
                restaurantId
            );
            if (!isValidRestaurantId) {
                return res.send({
                    isSuccess: false,
                    code: 410,
                    message: "없는 학생아이디 입니다.",
                });
            }

            const [rows] = await indexDao.deleteRestaurant(
                connection,
                restaurantId
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200,
                message: "학생 삭제 성공",
            });
        } catch (err) {
            logger.error(
                `deleteRestaurant Query error\n: ${JSON.stringify(err)}`
            );
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `deleteRestaurant DB Connection error\n: ${JSON.stringify(err)}`
        );
        return false;
    }
};
