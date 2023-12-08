document.getElementById('submitButton').addEventListener('click', function () {
    window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form data
        const firstName = document.getElementById('fname').value;
        const lastName = document.getElementById('lname').value;
        const organizationName = document.getElementById('organisation').value;
        const emailId = document.getElementById('mail').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('cpassword').value;
        const dateOfBirth = document.getElementById('dateofbirth').value;
        const roleDropdown = document.getElementById('role');
        const selectedRole = roleDropdown.options[roleDropdown.selectedIndex].value;


        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Create an object with the user data
        const userData = {
            firstName,
            lastName,
            organizationName,
            emailId,
            password,
            dateOfBirth,
            role: selectedRole
        };

        // Send the user data to the server
        fetch('http://34.125.235.0:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});
