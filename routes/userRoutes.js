const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const check = require('../middlewares/auth');

const userRoutes = (db) => {

    /**
     * @swagger
     * /api/user/register:
     *   post:
     *     summary: Register a new user
     *     description: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               lastname:
     *                 type: string
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *               birthdate:
     *                 type: string
     *               age:
     *                 type: integer
     *     responses:
     *       '201':
     *         description: User registered successfully
     *       '400':
     *         description: Bad request
     */
    router.post('/register', (req, res) => userController.register(db, req, res));

    /**
     * @swagger
     * /api/user/login:
     *   post:
     *     summary: Login a user
     *     description: Login a user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       '201':
     *         description: user logged in successfully
     *       '400':
     *         description: Bad request
     */
    router.post('/login', (req, res) => userController.login(db, req, res));

    /**
     * @swagger
     * /api/user/profile/{id}:
     *   get:
     *     summary: Get user profile by ID
     *     description: Get user profile by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the user
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: User profile retrieved successfully
     *       '404':
     *         description: User not found
     *       '500':
     *         description: Internal server error
     */
    router.get('/profile/:id', check.auth, (req, res) => userController.profile(db, req, res));
    
    return router;

}

module.exports = userRoutes;
