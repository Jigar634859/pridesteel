document.addEventListener("DOMContentLoaded", function () {
    let signup = document.querySelector(".signup");
    let login = document.querySelector(".login");
    let slider = document.querySelector(".slider");
    let formSection = document.querySelector(".form-section");

    signup.addEventListener("click", () => {
        slider.classList.add("moveslider");
        formSection.classList.add("form-section-move");
    });

    login.addEventListener("click", () => {
        slider.classList.remove("moveslider");
        formSection.classList.remove("form-section-move");
    });

    // Handling form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(loginForm);

        // Send POST request to server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Assuming server returns JSON
        })
        .then(data => {
            console.log('Server Response:', data);

            if (data.includes('email and password require')) {
                // Redirect or update UI for successful login
                alert('email and password require');
                // Example: Redirect to dashboard page
                
            } else if(data.includes('false')) {
                // Handle wrong password or email
                alert('Wrong email or password. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to login. Please try again later.');
        });
    });
});
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(signupForm);

    // Send POST request to server
    fetch('/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Assuming server returns plain text
    })
    .then(data => {
        console.log('Server Response:', data);

        if (data.includes('email exist')) {
            alert('email exist');
        } else {
            // Successful response will render the OTP page
            document.open();
            document.write(data);
            document.close();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to sign up. Please try again later.');
    });
});
