$(document).ready(function () {

    let userId = '';
    const editUserBtn = document.querySelector('.editUserBtn');
    const deleteBtn = document.querySelector('.deleteBtn');
    const deleteRoomBtn = document.querySelectorAll('.deleteRoom');




    if (editUserBtn != null) {
        userId = editUserBtn.getAttribute('id');
        console.log(userId);
        editUserBtn.addEventListener('click', editUser);
    }

    for (let roomBtn of deleteRoomBtn) {
        console.log(roomBtn);
        if (roomBtn != null) {
            roomBtn.addEventListener('click', function () {
                let room = deleteBtn.getAttribute('id');
                console.log(room);
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        axios({
                            method: 'delete',
                            url: 'http://localhost:3000/room/delete/' + room
                        })
                            .then(res => console.log(res))
                            .catch(err => console.error(err));
                        window.location.href = '/api/users/dashboard';
                    }
                })
            });
        }
    }

    if (deleteBtn != null) {
        deleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            userId = deleteBtn.getAttribute('id');
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    axios({
                        method: 'delete',
                        url: 'http://localhost:3000/api/users/delete/' + userId
                    })
                        .then(res => console.log(res))
                        .catch(err => console.error(err));
                    window.location.href = '/api/users/login';
                }
            })
        });
    }

    function editUser() {
        console.log("edit");
        axios({
            method: 'get',
            url: 'http://localhost:3000/api/users/' + userId + '/edit'
        })
            .then(res => console.log(res))
            .catch(err => console.error(err));

        // Setting up the action url
        document.getElementById('editForm').action = `/api/users/edit/${userId}`;
    }
});
