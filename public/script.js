// Optimized JavaScript with performance best practices
(function () {
  "use strict";

  // Cache DOM elements
  const elements = {
    header: document.querySelector(".header"),
    hamburger: document.querySelector(".hamburger"),
    navMenu: document.querySelector(".nav-menu"),
    navLinks: document.querySelectorAll(".nav-link"),
    contactForm: document.querySelector(".contact-form"),
    featureCards: document.querySelectorAll(".feature-card"),
    serviceCards: document.querySelectorAll(".service-card"),
    heroButtons: document.querySelectorAll(".hero-buttons .btn"),
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

  // Form handling with validation
  function initContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      // Basic validation
      const name = this.querySelector('input[type="text"]').value.trim();
      const email = this.querySelector('input[type="email"]').value.trim();
      const message = this.querySelector("textarea").value.trim();

      if (!name || !email || !message) {
        showNotification("Пожалуйста, заполните все поля", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Пожалуйста, введите корректный email", "error");
        return;
      }

      // Simulate form submission
      submitButton.textContent = "Отправляем...";
      submitButton.disabled = true;

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        showNotification("Сообщение успешно отправлено!", "success");
        this.reset();
      } catch (error) {
        showNotification("Произошла ошибка при отправке", "error");
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
      borderRadius: "8px",
      color: "white",
      fontWeight: "500",
      zIndex: "10000",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      maxWidth: "300px",
    });

    // Set background color based on type
    switch (type) {
      case "success":
        notification.style.background = "#10B981";
        break;
      case "error":
        notification.style.background = "#EF4444";
        break;
      default:
        notification.style.background = "#6366F1";
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

    // Animate feature cards
    elements.featureCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(50px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });

    // Animate service cards
    elements.serviceCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(50px)";
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });
  }

  // Button click effects
  function initButtonEffects() {
    elements.heroButtons.forEach((button) => {
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
          background: "rgba(255, 255, 255, 0.6)",
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
            `;
      document.head.appendChild(style);
    }
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Log Core Web Vitals
    if ("web-vital" in window) {
      import("https://unpkg.com/web-vitals@3.3.2/dist/web-vitals.js").then(
        ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log);
          getFID(console.log);
          getFCP(console.log);
          getLCP(console.log);
          getTTFB(console.log);
        },
      );
    }

    // Monitor page load performance
    window.addEventListener("load", () => {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log(
        "Page Load Time:",
        perfData.loadEventEnd - perfData.loadEventStart,
        "ms",
      );
    });
  }

  // Preload critical resources
  function preloadResources() {
    const criticalImages = [
      // Add any critical images here
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
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
    initContactForm();
    initScrollAnimations();
    initButtonEffects();
    addRippleAnimation();
    preloadResources();

    // Add scroll listener
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });

    // Initialize performance monitoring in production
    if (location.hostname !== "localhost") {
      initPerformanceMonitoring();
    }

    console.log("🚀 Site initialized successfully!");
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Handle page visibility changes for performance
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Pause animations and reduce activity when page is hidden
      console.log("Page hidden - reducing activity");
    } else {
      // Resume normal activity when page is visible
      console.log("Page visible - resuming activity");
    }
  });
})();

// Service Worker registration for PWA features (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Export for potential use in other scripts
window.SiteUtils = {
  showNotification: function (message, type) {
    // Reuse the notification function
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    document.dispatchEvent(event);
  },
};
