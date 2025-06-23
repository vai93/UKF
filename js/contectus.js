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

// ukf_chatbot.js
// Path to your Excel file;
const UKF_EXCEL_PATH = 'ukf_chatbot_real_nested.xlsx';

let ukfData = [];
let ukfCurrentView = 'main';
let ukfCurrentCategory = null;
let ukfCurrentSub = null;

document.addEventListener('DOMContentLoaded', () => {
    const ukfToggleBtn = document.getElementById('ukf-chat-toggle-btn');
    const ukfContainer = document.getElementById('ukf-chatbot-container');
    const ukfOutput = document.getElementById('ukf-chat-output');
    const ukfPopup = document.getElementById('ukf-chat-popup');
    const ukfCloseBtn = document.getElementById('ukf-chat-close-btn');

    ukfToggleBtn.addEventListener('click', () => {
        const ukfIsOpen = ukfContainer.style.display === 'flex';
        if (ukfIsOpen) {
            ukfContainer.style.display = 'none';
            ukfToggleBtn.setAttribute('aria-pressed', 'false');
        } else {
            ukfContainer.style.display = 'flex';
            ukfToggleBtn.setAttribute('aria-pressed', 'true');
            if (ukfData.length && ukfCurrentView === 'main') ukfShowCategories();
        }
        ukfPopup.style.animation = '';
        ukfPopup.style.opacity = '0';
    });

    ukfCloseBtn.addEventListener('click', () => {
        ukfContainer.style.display = 'none';
        ukfToggleBtn.setAttribute('aria-pressed', 'false');
    });

    fetch(UKF_EXCEL_PATH)
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const workbook = XLSX.read(buffer, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            ukfData = XLSX.utils.sheet_to_json(sheet);
            if (ukfContainer.style.display === 'flex') ukfShowCategories();
        })
        .catch(err => {
            console.error('Failed to load Excel:', err);
        });

    function ukfShowCategories() {
        ukfCurrentView = 'main';
        ukfOutput.innerHTML = '<div class="ukf-message ukf-bot">Select a Category:</div>';
        const categories = [...new Set(ukfData.map(row => row.Category))];
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'ukf-btn';
            btn.textContent = cat;
            btn.onclick = () => {
                ukfCurrentCategory = cat;
                ukfShowSubcategories(cat);
            };
            ukfOutput.appendChild(btn);
        });
    }

    function ukfShowSubcategories(category) {
        ukfCurrentView = 'sub';
        const subs = [...new Set(
            ukfData
                .filter(row => row.Category === category && row.Subcategory)
                .map(row => row.Subcategory)
        )];
        ukfOutput.innerHTML = `<div class="ukf-message ukf-bot">${subs.length ? 'Choose a Subcategory:' : 'Select a Question:'
            }</div>`;
        if (subs.length) {
            subs.forEach(sub => {
                const btn = document.createElement('button');
                btn.className = 'ukf-btn';
                btn.textContent = sub;
                btn.onclick = () => {
                    ukfCurrentSub = sub;
                    ukfShowQuestions(category, sub);
                };
                ukfOutput.appendChild(btn);
            });
        } else {
            ukfShowQuestions(category, '');
        }
        ukfAppendBack(ukfShowCategories);
    }

    function ukfShowQuestions(category, sub) {
        ukfCurrentView = 'question';
        const filtered = ukfData.filter(row =>
            row.Category === category && row.Subcategory === sub
        );
        ukfOutput.innerHTML = `<div class="ukf-message ukf-bot">Select a Question:</div>`;
        filtered.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'ukf-btn';
            btn.textContent = q.Question;
            btn.onclick = () => ukfShowAnswer(q);
            ukfOutput.appendChild(btn);
        });
        ukfAppendBack(() => ukfShowSubcategories(category));
    }

    function ukfShowAnswer(row) {
        ukfOutput.innerHTML = `
      <div class="ukf-message ukf-user">${row.Question}</div>
      <div class="ukf-message ukf-bot">${row.Answer}</div>
    `;
        ukfAppendBack(() => ukfShowQuestions(row.Category, row.Subcategory));
    }

    function ukfAppendBack(callback) {
        const back = document.createElement('button');
        back.className = 'ukf-btn ukf-back-btn';
        back.textContent = '🔙 Back';
        back.onclick = callback;
        ukfOutput.appendChild(back);
    }

    window.addEventListener('load', () => {
        ukfPopup.style.animation = 'none';
        void ukfPopup.offsetWidth;
        ukfPopup.style.animation = 'ukf-slideInOut 6s ease-in-out forwards';
        ukfPopup.addEventListener('animationend', () => {
            ukfPopup.style.opacity = '0';
        }, { once: true });
    });
});
