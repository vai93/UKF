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
