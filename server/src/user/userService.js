//dependencies
const userModel = require('./userModel');

//communicate with the database
module.exports.listUsersService = () => {

    //check URL
    return new Promise((resolve, reject) => {

        //return data
        userModel.find({})
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

        userModelData.save()
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                reject(false);
            });;
    });
}

module.exports.getUserService = (id) => {

    return new Promise((resolve, reject) => {

        userModel.findOne({ _id: id })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.updateUserService = (id, userDetails) => {

    return new Promise((resolve, reject) => {

        userModel.findOneAndUpdate({ _id: id }, { $set: userDetails }, { new: true })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.deleteUserService = (id) => {

    return new Promise((resolve, reject) => {

        userModel.findOneAndDelete({ _id: id })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

