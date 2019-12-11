class Users {
    constructor() {
        this.userList = [];
    }

    addUser(id, name) {
        console.log("inside addUser function");
        let newUser = {
            id: id,
            name: name
        }
        console.log(newUser);
        this.userList.push(newUser);
        console.log("AFTER ADDING USERS", this.userList);
        return newUser;
    }
}

module.exports = Users;

