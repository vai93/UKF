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
const CSV_PATH = 'ukf_chatbot_real_nested.xlsx';
let chatData = [], currentCat = null;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function scrollBottom() {
    cschatOutput.scrollTop = cschatOutput.scrollHeight;
}
async function typeMsg(el, txt, speed = 30) {
    el.textContent = '';
    for (let i = 1; i <= txt.length; i++) {
        el.textContent = txt.slice(0, i);
        await sleep(speed);
    }
    new Audio('sounds/message-pop.mp3').play().catch(() => { });
}
async function showTyping(dur = 1500) {
    const ind = document.createElement('div');
    ind.className = 'cschat-typing';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div'); dot.className = 'dot';
        ind.appendChild(dot);
    }
    cschatOutput.appendChild(ind);
    scrollBottom();
    await sleep(dur);
    ind.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    cschatToggleBtn = document.getElementById('cschat-toggle-btn');
    cschatContainer = document.getElementById('cschat-container');
    cschatOutput = document.getElementById('cschat-output');
    cschatCloseBtn = document.getElementById('cschat-close-btn');
    cschatPopup = document.getElementById('cschat-popup');
    cschatEnd = document.getElementById('cschat-end');

    cschatToggleBtn.addEventListener('click', () => {
        const open = cschatContainer.style.display === 'flex';
        cschatContainer.style.display = open ? 'none' : 'flex';
        cschatToggleBtn.setAttribute('aria-pressed', (!open).toString());
        if (!open && chatData.length) showCategories();
        cschatPopup.style.opacity = '0';
    });
    cschatCloseBtn.addEventListener('click', () => {
        cschatContainer.style.display = 'none';
        cschatToggleBtn.setAttribute('aria-pressed', 'false');
    });

    fetch(CSV_PATH)
        .then(r => r.arrayBuffer())
        .then(buf => {
            const wb = XLSX.read(buf, { type: 'array' });
            chatData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        }).catch(console.error);

    window.addEventListener('load', () => {
        cschatPopup.style.animation = 'cschat-slideInOut 6s ease-in-out forwards';
    });
});

async function showCategories() {
    cschatOutput.innerHTML = '';
    await showTyping();
    const intro = document.createElement('div');
    intro.className = 'cschat-message cschat-bot';
    cschatOutput.appendChild(intro);
    await typeMsg(intro, 'Welcome to UKFservices! How can I help you today?', 30);
    scrollBottom();

    const grid = document.createElement('div');
    grid.className = 'cschat-grid';
    [...new Set(chatData.map(r => r.Category))].forEach((cat, i) => {
        const btn = document.createElement('button');
        btn.className = 'cschat-btn';
        btn.textContent = cat;
        btn.style.animationDelay = `${i * 0.05}s`;
        btn.onclick = async () => {
            grid.remove();
            const usr = document.createElement('div');
            usr.className = 'cschat-message cschat-user';
            usr.textContent = cat;
            cschatOutput.appendChild(usr);
            scrollBottom();
            currentCat = cat;
            await sleep(200);
            showSubcats(cat);
        };
        grid.appendChild(btn);
    });
    cschatOutput.appendChild(grid);
    scrollBottom();
}

async function showSubcats(category) {
    await showTyping();
    const prompt = document.createElement('div');
    prompt.className = 'cschat-message cschat-bot';
    cschatOutput.appendChild(prompt);
    await typeMsg(prompt, 'Alright! Can you be a bit more specific?', 25);
    scrollBottom();

    const grid = document.createElement('div');
    grid.className = 'cschat-grid';
    [...new Set(chatData.filter(r => r.Category === category).map(r => r.Subcategory))]
        .forEach((sub, i) => {
            const btn = document.createElement('button');
            btn.className = 'cschat-btn';
            btn.textContent = sub;
            btn.style.animationDelay = `${i * 0.05}s`;
            btn.onclick = async () => {
                grid.remove();
                const usr = document.createElement('div');
                usr.className = 'cschat-message cschat-user';
                usr.textContent = sub;
                cschatOutput.appendChild(usr);
                scrollBottom();
                await sleep(200);
                showQuestions(category, sub);
            };
            grid.appendChild(btn);
        });
    cschatOutput.appendChild(grid);
    scrollBottom();
}

async function showQuestions(category, sub) {
    await showTyping();
    const prompt = document.createElement('div');
    prompt.className = 'cschat-message cschat-bot';
    cschatOutput.appendChild(prompt);
    await typeMsg(prompt, 'Select a question:', 25);
    scrollBottom();

    const grid = document.createElement('div');
    grid.className = 'cschat-grid';
    chatData.filter(r => r.Category === category && r.Subcategory === sub)
        .forEach((row, i) => {
            const btn = document.createElement('button');
            btn.className = 'cschat-btn';
            btn.textContent = row.Question;
            btn.style.animationDelay = `${i * 0.05}s`;
            btn.onclick = async () => {
                grid.remove();
                const usr = document.createElement('div');
                usr.className = 'cschat-message cschat-user';
                usr.textContent = row.Question;
                cschatOutput.appendChild(usr);
                scrollBottom();
                await sleep(200);
                showAnswer(row);
            };
            grid.appendChild(btn);
        });
    cschatOutput.appendChild(grid);
    scrollBottom();
}

async function showAnswer(row) {
    await showTyping();
    const bot = document.createElement('div');
    bot.className = 'cschat-message cschat-bot';
    cschatOutput.appendChild(bot);
    await typeMsg(bot, row.Answer, 25);
    scrollBottom();

    const grid = document.createElement('div');
    grid.className = 'cschat-grid';
    ['End Chat', 'Repeat Chat'].forEach((lbl, i) => {
        const btn = document.createElement('button');
        btn.className = 'cschat-btn ' + (lbl === 'End Chat' ? 'cschat-btn-end' : 'cschat-btn-repeat');
        btn.textContent = lbl;
        btn.style.animationDelay = `${i * 0.05}s`;
        btn.onclick = () => lbl === 'End Chat' ? endChat() : showCategories();
        grid.appendChild(btn);
    });
    cschatOutput.appendChild(grid);
    scrollBottom();
}

function endChat() {
    cschatOutput.innerHTML = '';
    cschatEnd.style.display = 'block';
    setTimeout(() => {
        cschatEnd.style.display = 'none';
        cschatContainer.style.display = 'none';
        cschatToggleBtn.setAttribute('aria-pressed', 'false');
    }, 4000);
}
