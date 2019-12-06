$(document).ready(function () {
    fetch('http://localhost:3000/users').then(result => {
        console.log(result);
        return result.json();
    })
        .then(data => {
            console.log(data);
            loadUsers(data);
        });

    function loadUsers(data) {
        let x = "";
        let id = 1;
        for (let user of data) {
            x += `  <ul> <li>${id} ${user.name} ${user.email} ${user.username} ${user.profileimage}
                         <button type="button" class="btn btn-danger deleteUser" id="${user._id}" >Delete</button>
                         <button types="button" class="btn btn-primary setEditModal" data-toggle="modal"
                                data-target="#editUser" id="${user._id}">
                                Edit
                            </button></li>
                        </ul> `;

            document.getElementById('userProfile').innerHTML = x;
            id++;
        }
    }
});
