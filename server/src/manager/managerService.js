// dependencies
const managerModel = require('./managerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT secret key (in production, this should be in environment variables)
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// REGISTER SERVICE
module.exports.registerManagerService = (managerDetails) => {

    return new Promise((resolve, reject) => {

        // First, check if email already exists
        managerModel.findOne({ email: managerDetails.email })
            .then((existingManager) => {

                if (existingManager) {
                    reject({ message: 'Email already registered' });
                    return;
                }

                // Hash the password
                return bcrypt.hash(managerDetails.password, 10);
            })
            .then((hashedPassword) => {

                // Create new manager with hashed password
                const managerModelData = new managerModel();

                managerModelData.name = managerDetails.name;
                managerModelData.email = managerDetails.email;
                managerModelData.password = hashedPassword;
                managerModelData.profilePicture = managerDetails.profilePicture || '';
                managerModelData.bio = managerDetails.bio || '';

                return managerModelData.save();
            })
            .then(() => {
                resolve({ success: true, message: 'Manager registered successfully' });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// LOGIN SERVICE
module.exports.loginManagerService = (email, password) => {

    return new Promise((resolve, reject) => {

        let foundManager;

        // Find manager by email
        managerModel.findOne({ email: email })
            .then((manager) => {

                if (!manager) {
                    reject({ message: 'Invalid email or password' });
                    return;
                }

                foundManager = manager;

                // Compare password with hashed password
                return bcrypt.compare(password, manager.password);
            })
            .then((isPasswordMatch) => {

                if (!isPasswordMatch) {
                    reject({ message: 'Invalid email or password' });
                    return;
                }

                // Create JWT token
                const token = jwt.sign(
                    { id: foundManager._id, email: foundManager.email },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Return token and manager data (without password!)
                resolve({
                    success: true,
                    token: token,
                    manager: {
                        id: foundManager._id,
                        name: foundManager.name,
                        email: foundManager.email,
                        profilePicture: foundManager.profilePicture,
                        bio: foundManager.bio
                    }
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
};