$(document).ready(function () {
    const editUserBtn = document.querySelector('#editUserBtn');
    if (editUserBtn != null) {
        editUserBtn.addEventListener('click', editUser);
    }

    function editUser() {
        console.log("edit");
        axios({
            method: 'put',
            url: 'http://localhost:3000/api/users/edit',
        })
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }
});
