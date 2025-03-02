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
    navLinks.forEach(function(link) {
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
    