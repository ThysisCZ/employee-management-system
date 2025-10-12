const userService = require('./userService');

async function listUsersController(req, res) {
    // Get managerId from authenticated token
    const managerId = req.manager.id;

    const employees = await userService.listUsersService(managerId);
    res.send({ "status": true, "data": employees });
}

async function createUserController(req, res) {
    // Get managerId from authenticated token
    const managerId = req.manager.id;

    // Add managerId to the employee data
    const userDetails = {
        ...req.body,
        managerId: managerId
    };

    const status = await userService.createUserService(userDetails);

    if (status) {
        res.send({ "status": true, "message": "User created successfully." });
    } else {
        res.send({ "status": false, "message": "Error creating user." });
    }
}

async function getUserController(req, res) {
    try {
        const userId = req.params.id;
        const managerId = req.manager.id;

        const user = await userService.getUserService(userId, managerId);

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ message: 'User not found or access denied.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

async function updateUserController(req, res) {
    try {
        const userId = req.params.id;
        const managerId = req.manager.id;
        const userBody = req.body;

        const user = await userService.updateUserService(userId, userBody, managerId);

        if (user) {
            res.send({ "status": true, "message": "User updated successfully.", "data": user });
        } else {
            res.status(404).send({ message: 'User not found or access denied.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

async function deleteUserController(req, res) {
    try {
        const userId = req.params.id;
        const managerId = req.manager.id;

        const user = await userService.deleteUserService(userId, managerId);

        if (user) {
            res.send({ "status": true, "message": `User with ID '${userId}' deleted successfully.` });
        } else {
            res.status(404).send({ message: 'User not found or access denied.' });
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