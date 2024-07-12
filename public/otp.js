const j = document.getElementById("otp1");
const i = document.getElementById("otp2");
const g = document.getElementById("otp3");
const a = document.getElementById("otp4");
const r = document.getElementById("otp5");
const t = document.getElementById("otp6");
const button = document.querySelector("button");
const inputs = [j, i, g, a, r, t];

// iterate over all inputs
inputs.forEach((input, index1) => {
input.addEventListener("keyup", (e) => {
  // This code gets the current input element and stores it in the currentInput variable
  // This code gets the next sibling element of the current input element and stores it in the nextInput variable
  // This code gets the previous sibling element of the current input element and stores it in the prevInput variable
  const currentInput = input,
    nextInput = input.nextElementSibling,
    prevInput = input.previousElementSibling;

  // if the value has more than one character then clear it
  if (currentInput.value.length > 1) {
    currentInput.value = "";
    return;
  }
  // if the next input is disabled and the current value is not empty
  //  enable the next input and focus on it
  if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
    nextInput.removeAttribute("disabled");
    nextInput.focus();
  }

  // if the backspace key is pressed
  if (e.key === "Backspace") {
    // iterate over all inputs again
    inputs.forEach((input, index2) => {
      // if the index1 of the current input is less than or equal to the index2 of the input in the outer loop
      // and the previous element exists, set the disabled attribute on the input and focus on the previous element
      if (index1 <= index2 && prevInput) {
        input.setAttribute("disabled", true);
        input.value = "";
        prevInput.focus();
      }
    });
  }
  //if the fourth input( which index number is 3) is not empty and has not disable attribute then
  //add active class if not then remove the active class.
  if (!inputs[5].disabled && inputs[5].value !== "") {
    button.classList.add("active");
    return;
  }
  button.classList.remove("active");
});
});


//focus the first input which index is 0 on window load
window.addEventListener("load", () => inputs[0].focus());
function getOTPValues() {
  return inputs.map(input => input.value).join('');
}
document.getElementById("otpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const otpValues = getOTPValues();

  // Construct URL-encoded form data
  const formData = new URLSearchParams();
  formData.append('otp', otpValues);

  // Send the OTP to the server
  fetch('/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
 
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text(); // Read response as text
})
.then(data => {
    console.log('Server Response:', data);

    // Check if data is a string and contains expected messages
    if (typeof data === 'string') {
        if (data.includes('true')) {
            alert('User info stored successfully.');
            // Redirect or update UI as needed after success
        } else if (data.includes('false')) {
            alert('Entered wrong OTP.');
            // Handle wrong OTP scenario
        } else {
          window.location.href = '/main';
        }
    } else {
        console.error('Unexpected response format:', data);
        alert('Unexpected response from server.');
    }
})
.catch(error => {
    console.error('Error:', error);
    // Handle network errors or unexpected server responses
});
});
window.addEventListener("load", () => inputs[0].focus());