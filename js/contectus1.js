document.addEventListener("DOMContentLoaded", function () {
    var sidebar = document.getElementById("sidebarMenu");
    var toggler = document.querySelector(".navbar-toggler");
    var closeBtn = document.querySelector(".close-btn");
    var navLinks = document.querySelectorAll(".sidebar ul li a");

    // Open sidebar when clicking the toggler button (for small screens)
    toggler.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });

    // Close sidebar when clicking the close button
    closeBtn.addEventListener("click", function () {
        sidebar.classList.remove("show");
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggler.contains(event.target)) {
            sidebar.classList.remove("show");
        }
    });

    // Close sidebar when clicking any navigation link
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            sidebar.classList.remove("show");
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.querySelector('.navbar-collapse');
    var toggler = document.querySelector('.navbar-toggler');

    // Close navbar when clicking outside
    document.addEventListener('click', function (event) {
        if (navbar.classList.contains('show') && !navbar.contains(event.target) && !toggler.contains(event.target)) {
            new bootstrap.Collapse(navbar).hide();
        }
    });

    // Toggle navbar when clicking the toggler button
    toggler.addEventListener('click', function () {
        if (navbar.classList.contains('show')) {
            new bootstrap.Collapse(navbar).hide();
        } else {
            new bootstrap.Collapse(navbar).show();
        }
    });
});


const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        name: `${form.firstName.value} ${form.lastName.value}`,
        email: form.email.value,
        contact: form.phone.value,
        message: form.message.value,
        websiteId: "UKF"
    };


    try {
        const res = await fetch("https://my-mailserver.vercel.app/api/contactMail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        alert("Thank you for contacting us! We will get back to you soon.");
        form.reset();
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
});
