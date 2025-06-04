// SmartCare Pet Care Website JavaScript
(function () {
  "use strict";

  // Cache DOM elements
  const elements = {
    header: document.querySelector(".header"),
    hamburger: document.querySelector(".hamburger"),
    navMenu: document.querySelector(".nav-menu"),
    navLinks: document.querySelectorAll(".nav-link"),
    newsletterForm: document.querySelector(".newsletter-form"),
    serviceCards: document.querySelectorAll(".service-card"),
    productCards: document.querySelectorAll(".product-card"),
    blogCards: document.querySelectorAll(".blog-card"),
    buttons: document.querySelectorAll(".btn"),
  };

  // Utility functions
  const utils = {
    throttle: function (func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    debounce: function (func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    isInViewport: function (element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },
  };

  // Header scroll effect
  const handleHeaderScroll = utils.throttle(() => {
    const scrollY = window.pageYOffset;
    const header = elements.header;

    if (scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "none";
    }
  }, 16);

  // Smooth scrolling for navigation links
  function initSmoothScrolling() {
    elements.navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const headerHeight = elements.header.offsetHeight;
          const targetOffset = targetSection.offsetTop - headerHeight;

          window.scrollTo({
            top: targetOffset,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Mobile menu toggle
  function initMobileMenu() {
    if (elements.hamburger && elements.navMenu) {
      elements.hamburger.addEventListener("click", function () {
        this.classList.toggle("active");
        elements.navMenu.classList.toggle("active");

        // Animate hamburger
        const spans = this.querySelectorAll("span");
        spans.forEach((span, index) => {
          if (this.classList.contains("active")) {
            if (index === 0)
              span.style.transform = "rotate(45deg) translate(5px, 5px)";
            if (index === 1) span.style.opacity = "0";
            if (index === 2)
              span.style.transform = "rotate(-45deg) translate(7px, -6px)";
          } else {
            span.style.transform = "none";
            span.style.opacity = "1";
          }
        });
      });
    }
  }

  // Newsletter form handling
  function initNewsletterForm() {
    if (!elements.newsletterForm) return;

    elements.newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      const email = emailInput.value.trim();

      if (!email || !isValidEmail(email)) {
        showNotification("Пожалуйста, введите корректный email", "error");
        return;
      }

      // Simulate form submission
      submitButton.textContent = "Отправляем...";
      submitButton.disabled = true;

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showNotification("Спасибо за подписку! 🐾", "success");
        emailInput.value = "";
      } catch (error) {
        showNotification("Произошла ошибка при подписке", "error");
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Styles for notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "15px 20px",
      borderRadius: "12px",
      color: "white",
      fontWeight: "500",
      zIndex: "10000",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      maxWidth: "300px",
      fontSize: "0.95rem",
    });

    // Set background color based on type
    switch (type) {
      case "success":
        notification.style.background = "#FF8B5A";
        break;
      case "error":
        notification.style.background = "#EF4444";
        break;
      default:
        notification.style.background = "#6B7EFF";
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Intersection Observer for animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Animate cards with stagger effect
    const allCards = [
      ...elements.serviceCards,
      ...elements.productCards,
      ...elements.blogCards,
    ];

    allCards.forEach((card, index) => {
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
      }
    });

    // Animate welcome cards
    const welcomeCards = document.querySelectorAll(".welcome-card");
    welcomeCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
      observer.observe(card);
    });
  }

  // Button click effects with ripple
  function initButtonEffects() {
    elements.buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        // Create ripple effect
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.classList.add("ripple");

        Object.assign(ripple.style, {
          position: "absolute",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.4)",
          transform: "scale(0)",
          animation: "ripple 0.6s linear",
          pointerEvents: "none",
        });

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);

        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);

        // Handle specific button actions
        if (this.textContent.includes("Book Now")) {
          showNotification("Booking system will be available soon! 🐾", "info");
        } else if (this.textContent.includes("Buy now")) {
          showNotification("Product added to cart! 🛒", "success");
        }
      });
    });
  }

  // Add ripple animation to CSS
  function addRippleAnimation() {
    if (!document.querySelector("#ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .welcome-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
        }
        
        .service-card:hover {
          transform: translateY(-3px);
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.15);
        }
        
        .blog-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.1);
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Floating animation for stat card
  function initFloatingAnimation() {
    const statCard = document.querySelector(".stat-card");
    if (statCard) {
      let start = null;

      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        const yOffset = Math.sin(progress * 0.002) * 5;
        statCard.style.transform = `translateY(${yOffset}px)`;

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }
  }

  // Pet care tips rotation
  function initPetTipsRotation() {
    const tips = [
      "🐕 Tip: Regular grooming keeps your pet healthy and happy!",
      "🐱 Tip: Schedule annual vet checkups for your furry friends!",
      "🐾 Tip: Daily walks are essential for your dog's wellbeing!",
      "💧 Tip: Always keep fresh water available for your pets!",
      "🏠 Tip: Create a comfortable space for your pet to rest!",
    ];

    let currentTip = 0;

    function showTip() {
      if (Math.random() > 0.7) {
        // 30% chance to show tip
        showNotification(tips[currentTip], "info");
        currentTip = (currentTip + 1) % tips.length;
      }
    }

    // Show tip every 30 seconds
    setInterval(showTip, 30000);
  }

  // Initialize everything when DOM is loaded
  function init() {
    // Check if browser supports required features
    if (!("IntersectionObserver" in window)) {
      console.warn("IntersectionObserver not supported");
      return;
    }

    initSmoothScrolling();
    initMobileMenu();
    initNewsletterForm();
    initScrollAnimations();
    initButtonEffects();
    addRippleAnimation();
    initFloatingAnimation();
    initPetTipsRotation();

    // Add scroll listener
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });

    console.log("🐾 SmartCare website initialized successfully!");
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Handle page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.log("Page hidden - pausing pet animations");
    } else {
      console.log("Page visible - resuming pet care experience");
    }
  });

  // Export utilities for external use
  window.SmartCareUtils = {
    showNotification: showNotification,
    isValidEmail: isValidEmail,
  };
})();

// Add some Easter egg interactions
document.addEventListener("keydown", function (e) {
  // Konami code for pet lovers: ↑↑↓↓←→←→BA
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  window.konamiSequence = window.konamiSequence || [];
  window.konamiSequence.push(e.keyCode);

  if (window.konamiSequence.length > konamiCode.length) {
    window.konamiSequence.shift();
  }

  if (
    window.konamiSequence.length === konamiCode.length &&
    window.konamiSequence.every((key, index) => key === konamiCode[index])
  ) {
    // Easter egg: Rain of paw prints
    const body = document.body;
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const paw = document.createElement("div");
        paw.innerHTML = "🐾";
        paw.style.position = "fixed";
        paw.style.left = Math.random() * window.innerWidth + "px";
        paw.style.top = "-50px";
        paw.style.fontSize = "2rem";
        paw.style.zIndex = "10000";
        paw.style.pointerEvents = "none";
        paw.style.animation = "fall 3s linear forwards";

        body.appendChild(paw);

        setTimeout(() => {
          if (paw.parentNode) {
            paw.parentNode.removeChild(paw);
          }
        }, 3000);
      }, i * 100);
    }

    // Add falling animation
    if (!document.querySelector("#easter-egg-styles")) {
      const style = document.createElement("style");
      style.id = "easter-egg-styles";
      style.textContent = `
        @keyframes fall {
          to {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    window.SmartCareUtils.showNotification(
      "🐾 You found the pet lover's secret! 🐾",
      "success",
    );
    window.konamiSequence = [];
  }
});
