//dependencies
const express = require('express');
const userController = require('../src/user/userController');
const managerController = require('../src/manager/managerController');
const { authenticateToken } = require('../src/middleware/authMiddleware');

//initialize router
const router = express.Router();

//routes for HTTP requests

// Manager routes (no auth needed for login/register)
router.route('/manager/register').post(managerController.registerManagerController);
router.route('/manager/login').post(managerController.loginManagerController);

// Employee routes (protected - need authentication)
router.route('/user/list').get(authenticateToken, userController.listUsersController);
router.route('/user/create').post(authenticateToken, userController.createUserController);
router.route('/user/get/:id').get(authenticateToken, userController.getUserController);
router.route('/user/update/:id').patch(authenticateToken, userController.updateUserController);
router.route('/user/delete/:id').delete(authenticateToken, userController.deleteUserController);

//export router
module.exports = router;