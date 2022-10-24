module.exports = function (app) {
    const index = require("../controllers/indexController");
    const jwtMiddleware = require("../../config/jwtMiddleware");

    //app.get("/dummy", function (req, res) {
    //    res.send("get dummy 요청 성공");
    //});

    // 라우터 정의
    // app.HTTP메서드(uri, 컨트롤러 콜백함수)
    //app.get("/dummy", index.example);

    app.get("/students", index.readStudents);
    app.get("/restaurants", index.readRestaurants);
    app.get("/student/:studentId", index.readStudent);
    app.get("/restaurant/:restaurantId", index.readRestaurant);
    app.get("/user/:userId", index.readUser);
    app.get("/restaurantsByCategory", index.readRestaurantByCategory);
    app.get("/restaurantsByCategory/:category", index.readRestaurantByCategory);
    app.post("/student", index.createStudent);
    app.post("/user", index.createUser);
    app.post("/restaurant", index.createRestaurant);
    app.patch("/student/:studentId", index.editStudent);
    app.patch("/restaurant/:restaurantId", index.editRestaurant);
    app.delete("/student/:studentId", index.deleteStudent);
    app.delete("/restaurant/:restaurantId", index.deleteRestaurant);
};
