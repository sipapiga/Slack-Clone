$(document).ready(function () {
    fetch('http://localhost:3000/users').then(result => {
        console.log(result);
        return result.json();
    })
        .then(data => {
            console.log(data);

        });
});
