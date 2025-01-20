function sendMail(e) {
    e.preventDefault();  // Prevent the form from submitting normally
    console.log("called");

    const email = "vkpatel93@gmail.com";
    const templateParams = {
        to_email: email,
        subject: "New Contact Request from...",
        message: `Name: ${document.getElementById('firstName').value} ${document.getElementById('lastName').value}\nEmail: ${document.getElementById('email').value}\nPhone: ${document.getElementById('phone').value}\nMessage: ${document.getElementById('message').value}`,
    };

    console.log("Form Data Collected:", templateParams);
    console.log("Sending email...");

    // Send email using EmailJS
    emailjs.send("service_z3kkqtd", "template_715wyrd", templateParams)
        .then((response) => {
            console.log(`Email sent successfully to ${email}`, response);
        })
        .catch((error) => {
            console.error(`Error sending email to ${email}`, error);
        });
}

document.querySelector('form').addEventListener('submit', sendMail);
