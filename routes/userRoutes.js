const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const check = require('../middlewares/auth');

const userRoutes = (db) => {
    router.post('/register', (req, res) => userController.register(db, req, res));
    router.post('/login', (req, res) => userController.login(db, req, res));
    router.get('/profile/:id', check.auth, (req, res) => userController.profile(db, req, res));
    return router;
}

module.exports = userRoutes;
