//dependencies
const userModel = require('./userModel');

//communicate with the database
module.exports.listUsersService = (managerId) => {

    return new Promise((resolve, reject) => {

        //return only employees belonging to this manager
        userModel.find({ managerId: managerId })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.createUserService = (userDetails) => {

    return new Promise((resolve, reject) => {

        const userModelData = new userModel();

        userModelData.name = userDetails.name;
        userModelData.address = userDetails.address;
        userModelData.phone = userDetails.phone;
        userModelData.managerId = userDetails.managerId;

        userModelData.save()
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.getUserService = (id, managerId) => {

    return new Promise((resolve, reject) => {

        // Find employee by ID AND verify it belongs to this manager
        userModel.findOne({ _id: id, managerId: managerId })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.updateUserService = (id, userDetails, managerId) => {

    return new Promise((resolve, reject) => {

        // Update only if employee belongs to this manager
        userModel.findOneAndUpdate(
            { _id: id, managerId: managerId },
            { $set: userDetails },
            { new: true }
        )
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.deleteUserService = (id, managerId) => {

    return new Promise((resolve, reject) => {

        // Delete only if employee belongs to this manager
        userModel.findOneAndDelete({ _id: id, managerId: managerId })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

