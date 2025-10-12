const userService = require('./userService');

async function listUsersController(req, res) {
    const employees = await userService.listUsersService();
    res.send({ "status": true, "data": employees })
}

async function createUserController(req, res) {
    const status = await userService.createUserService(req.body);

    if (status) {
        res.send({ "status": true, "message": "User created successfully." });
    } else {
        res.send({ "status": false, "message": "Error creating user." });
    }
}

async function getUserController(req, res) {
    try {
        //get ID from URL
        const userId = req.params.id;
        const user = await userService.getUserService(userId);

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ message: 'User not found.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

async function updateUserController(req, res) {
    try {
        //get ID from URL
        const userId = req.params.id;
        //get user JSON body
        const userBody = req.body;

        const user = await userService.updateUserService(userId, userBody);

        if (user) {
            res.send({ "status": true, "message": "User updated successfully.", "data": user });
        } else {
            res.status(404).send({ message: 'User not found.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

async function deleteUserController(req, res) {
    try {
        //get ID from URL
        const userId = req.params.id;
        const user = await userService.deleteUserService(userId);

        if (user) {
            res.send({ "status": true, "message": `User with ID '${userId}' deleted successfully.` });
        } else {
            res.status(404).send({ message: 'User not found.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

module.exports = {
    listUsersController,
    createUserController,
    getUserController,
    updateUserController,
    deleteUserController
}