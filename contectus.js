// Initialize EmailJS
(function () {
    emailjs.init("4evkZ7YdJmXN4dxeE"); // Replace with your EmailJS Public Key
    console.log("EmailJS Initialized");
})();

// Add an event listener to the form
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
    };

    console.log("Form Data Collected:", formData);

    // Perform basic validation
    if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields.');
        return;
    }

    // Ensure checkbox is checked
    if (!document.getElementById('privacy').checked) {
        alert('Please agree to the Privacy Policy.');
        return;
    }

    // Send email using EmailJS
    console.log("Sending email...");
    emailjs
        .send("service_3w6rd4i", "template_r87givd", formData)
        .then(
            function (response) {
                console.log("Email Sent!", response.status, response.text);
                alert("Message sent successfully!");
                document.querySelector('form').reset(); // Reset form fields
            },
            function (error) {
                console.error("Failed to send email:", error);
                alert("Failed to send the message. Please try again later.");
            }
        );
});