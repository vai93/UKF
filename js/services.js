  document.addEventListener("DOMContentLoaded", function() {
    const servicesCard = document.getElementById("servicesCard");
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Stop observing once shown
          }
        });
      }, { threshold: 0.1 });

      observer.observe(servicesCard);
    } else {
      servicesCard.classList.add('show');
    }
  });
  
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

