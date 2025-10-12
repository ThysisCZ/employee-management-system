// dependencies
const managerService = require('./managerService');

// REGISTER CONTROLLER
async function registerManagerController(req, res) {

    try {
        const managerDetails = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
            bio: req.body.bio
        };

        const result = await managerService.registerManagerService(managerDetails);

        res.status(201).send(result);

    } catch (error) {
        res.status(400).send({ success: false, message: error.message || 'Registration failed' });
    }
};

// LOGIN CONTROLLER
async function loginManagerController(req, res) {

    try {
        const { email, password } = req.body;

        const result = await managerService.loginManagerService(email, password);

        res.status(200).send(result);

    } catch (error) {
        res.status(401).send({ success: false, message: error.message || 'Login failed' });
    }
};

module.exports = {
    registerManagerController,
    loginManagerController
}