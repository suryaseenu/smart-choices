document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form data
        const email = document.getElementById('mail').value;
        const password = document.getElementById('password').value;

        // Create an object with the login data
        const loginData = {
            email,
            password,
        };


        // Send the login data to the server for authentication
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then(response => response.json())
            .then(data => {
                // Check if authentication was successful
                if (data.success) {
                    // Store user information in localStorage
                    localStorage.setItem('currentUser', (data.user));

                    // Redirect to the main page or dashboard
                    window.location.href = '../html/startSurvey.html';
                } else {
                    // Display an error message to the user
                    alert('Invalid email or password. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});

