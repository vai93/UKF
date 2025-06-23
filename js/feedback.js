document.addEventListener('DOMContentLoaded', function () {
    const ratingButtons = document.querySelectorAll('.rating-button');
    const submitBtn = document.getElementById('submit-btn');
    const thankyouScreen = document.getElementById('thank-you');
    const feedbackForm = document.querySelector('.feedback-form');
    const submitAnother = document.getElementById('submit-another');
    let selectedRating = null;

    // Rating selection
    ratingButtons.forEach(button => {
        button.addEventListener('click', function () {
            const value = parseInt(this.getAttribute('data-value'));

            // Remove active class from all buttons
            ratingButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to the clicked button
            this.classList.add('active');

            selectedRating = value;

            // Add pulse animation to the rating rows
            const container1 = document.getElementById('rating-row-1');
            const container2 = document.getElementById('rating-row-2');
            container1.classList.add('pulse');
            container2.classList.add('pulse');
            setTimeout(() => {
                container1.classList.remove('pulse');
                container2.classList.remove('pulse');
            }, 500);
        });
    });

    // Form submission
    submitBtn.addEventListener('click', async function () {
        if (selectedRating === null) {
            alert('Please select a rating');
            return;
        }

        const feedbackText = document.getElementById('feedback').value.trim();
        const email = document.getElementById('email').value.trim();

        // Set loading state
        this.classList.add('loading');
        this.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            </svg>
            Sending...
        `;

        const payload = {
            rating: selectedRating,
            feedback: feedbackText,
            email: email,
            websiteId: 'UKF' // or "ISC" if dynamic
        };

        try {
            const res = await fetch("https://my-mailserver.vercel.app/api/feedbackMail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Submission failed");
            }

            feedbackForm.style.display = 'none';
            thankyouScreen.style.display = 'block';
            thankyouScreen.classList.add('fade-in');
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");

            // Reset submit button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                SEND FEEDBACK
            `;
        }
    });

    // Submit another response
    submitAnother.addEventListener('click', function () {
        thankyouScreen.style.display = 'none';
        feedbackForm.style.display = 'block';

        // Reset form
        ratingButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('feedback').value = '';
        document.getElementById('email').value = '';
        selectedRating = null;

        // Reset submit button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            SEND FEEDBACK
        `;
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
