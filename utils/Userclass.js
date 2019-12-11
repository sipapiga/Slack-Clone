class Users {
    constructor() {
        this.userList = [];
    }

    addUser(id, name, room) {
        console.log("inside addUser function");
        let newUser = {
            id: id,
            name: name,
            room: room
        }
        console.log(newUser);
        this.userList.push(newUser);
        console.log("AFTER ADDING USERS", this.userList);
        return newUser;
    }

    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            this.userList = this.userList.filter((user) => {
                user.id != id
            });
            return user;
        }
    }

    getUser(id) {
        let getUser = this.userList.filter((user) => {
            return user.id === id;
        })[0];
        return getUser;
    }

    getUsersList(room) {
        let users = this.userList.filter((user) => {
            return user.room === room;
        });

        let names = users.map((user) => {
            return user.name;
        });

        return names;

    }
}

module.exports = Users;

