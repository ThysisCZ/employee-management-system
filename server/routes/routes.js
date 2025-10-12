//dependencies
const express = require('express');
const userController = require('../src/user/userController');
const managerController = require('../src/manager/managerController');

//initialize router
const router = express.Router();

//routes for HTTP requests
router.route('/user/list').get(userController.listUsersController);
router.route('/user/create').post(userController.createUserController);
router.route('/user/get/:id').get(userController.getUserController);
router.route('/user/update/:id').patch(userController.updateUserController);
router.route('/user/delete/:id').delete(userController.deleteUserController);

router.route('/manager/register').post(managerController.registerManagerController);
router.route('/manager/login').post(managerController.loginManagerController);

//export router
module.exports = router;