const { pool } = require("../../config/database");

exports.selectStudents = async function (connection, params) {
    const Query = `SELECT * FROM testdb2.Students;`;
    const Params = [];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.selectRestaurants = async function (connection, params) {
    const Query = `SELECT * FROM testdb2.Restaurants;`;
    const Params = [];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.selectStudent = async function (connection, studentId) {
    const Query = `SELECT * FROM testdb2.Students WHERE id = ?;`;
    const Params = [studentId];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.selectUser = async function (connection, userId) {
    let Query, Params;
    Query = `SELECT * FROM testdb2.Users WHERE userId = ?;`;
    Params = userId;

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.selectRestaurant = async function (connection, restaurantId) {
    const Query = `SELECT * FROM testdb2.Restaurants WHERE id = ?;`;
    const Params = [restaurantId];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.selectRestaurantByCategory = async function (connection, category) {
    let Query, Params;
    if (category) {
        Query = `SELECT * FROM testdb2.Restaurants WHERE status = 'A' AND category = ?;`;
        Params = category;
    } else {
        Query = `SELECT * FROM testdb2.Restaurants WHERE status = 'A';`;
        Params = "";
    }

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.insertStudent = async function (
    connection,
    name,
    major,
    birth,
    address
) {
    const Query = `INSERT INTO Students (name, major, birth, address) VALUES (?, ?, ?, ?);`;
    const Params = [name, major, birth, address];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.insertRestaurant = async function (
    connection,
    title,
    address,
    videoUrl,
    category
) {
    const Query = `INSERT INTO Restaurants (title, address, videoUrl, category) VALUES (?, ?, ?, ?);`;
    const Params = [title, address, videoUrl, category];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.insertUser = async function (connection, nickname, userId, password) {
    const Query = `INSERT INTO Users (nickname, userId, password) VALUES (?, ?, ?);`;
    const Params = [nickname, userId, password];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.isValidStudentId = async function (connection, studentId) {
    const Query = `SELECT * FROM testdb2.Students WHERE id = ? and Status = 'A';`;
    const Params = [studentId];

    const [rows] = await connection.query(Query, Params);

    if (rows < 1) return false;
    else return true;
};

exports.isValidRestaurantId = async function (connection, restaurantId) {
    const Query = `SELECT * FROM testdb2.Restaurants WHERE id = ? and Status = 'A';`;
    const Params = [restaurantId];

    const [rows] = await connection.query(Query, Params);

    if (rows < 1) return false;
    else return true;
};

exports.updateStudent = async function (
    connection,
    name,
    major,
    birth,
    address,
    studentId
) {
    const Query = `update Students SET name = ifnull(?, name), major = ifnull(?, major), 
        birth = ifnull(?, birth), address = ifnull(?, address) WHERE id = ?;`;
    const Params = [name, major, birth, address, studentId];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.updateRestaurant = async function (
    connection,
    title,
    address,
    videoUrl,
    category,
    restaurantId
) {
    const Query = `update Restaurants SET title = ifnull(?, title)
        , address = ifnull(?, address), videoUrl = ifnull(?, videoUrl)
        , category = ifnull(?, category) WHERE id = ?;`;
    const Params = [title, address, videoUrl, category, restaurantId];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.deleteStudent = async function (connection, studentId) {
    const Query = `update Students SET status = 'D' WHERE id = ?;`;
    const Params = [studentId];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.deleteRestaurant = async function (connection, restaurantId) {
    const Query = `update Restaurants SET status = 'D' WHERE id = ?;`;
    const Params = [restaurantId];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.exampleDao = async function (connection, params) {
    // const Query = `SELECT * FROM testdb2.Lectures;`;
    const Query = ``;
    const Params = [];

    const rows = await connection.query(Query, Params);

    return rows;
};
