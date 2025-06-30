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

