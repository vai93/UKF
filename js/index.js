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

function handleScroll() {
    const section = document.getElementById('infoSection');
    const cards = document.querySelectorAll('.info-card');
    const sectionPosition = section.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;

    if (sectionPosition < screenPosition) {
        section.style.opacity = '1';
        section.style.transform = 'translateX(0)';
        cards.forEach((card, index) => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        });
    } else {
        section.style.opacity = '0';
        section.style.transform = 'translateX(-100%)';
        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-100px)';
        });
    }
}

window.addEventListener('scroll', handleScroll);

document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        root: null, // Use the viewport as the root
        threshold: 0.2, // Trigger when 30% of the element is visible
    };

    const callback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active"); // Add the active class
                observer.unobserve(entry.target); // Stop observing once triggered
            }
        });
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    // Observe all elements with the animated-text class
    const animatedElements = document.querySelectorAll(".animated-text, .list, .carousel-inner img");
    animatedElements.forEach((element) => {
        observer.observe(element);
    });
});



document.querySelectorAll(".social-icons a").forEach((icon) => {
    icon.addEventListener("mouseover", () => {
        icon.style.transform = "scale(1.1)";
    });
    icon.addEventListener("mouseout", () => {
        icon.style.transform = "scale(1)";
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.info-card');

    const observerOptions = {
        root: null, // Use the viewport as the root
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
});
document.getElementById('learnMoreButton').addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
});

// Animate on scroll for original animated-text elements (excluding toggle-text)
function animateOnScroll() {
    const elements = document.querySelectorAll('.animated-text:not(.toggle-text)');
    elements.forEach(element => {
        const elementPos = element.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;
        if (elementPos < screenPos) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

function toggleContent() {
    var moreContent = document.getElementById('moreContent');
    var toggleText = document.getElementById('toggleText');
    var toggleButton = document.getElementById('toggleButton');

    if (moreContent.classList.contains('active')) {
        // Collapse extra content
        moreContent.classList.remove('active');
        toggleText.classList.remove('active');
        toggleButton.innerText = 'Read More';

        // Force reflow to reset the animation so it can play again
        void moreContent.offsetWidth;
        void toggleText.offsetWidth;

    } else {
        // Expand extra content
        moreContent.classList.add('active');
        // Short delay so container can expand first, then text animates
        setTimeout(() => {
            toggleText.classList.add('active');
        }, 50);

        toggleButton.innerText = 'Read Less';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const scrollToTop = document.getElementById("scrollToTop");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
            scrollToTop.style.display = "block";
        } else {
            scrollToTop.style.display = "none";
        }
    });

    scrollToTop.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
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




  const video = document.getElementById('background-video');
  const fallbackImg = document.getElementById('videoFallback');

  video.onerror = function () {
    video.style.display = 'none';
    fallbackImg.style.display = 'block';
  };

  video.oncanplay = function () {
    fallbackImg.style.display = 'none';
    video.style.display = 'block';
  };


