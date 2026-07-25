document.addEventListener('DOMContentLoaded', () => {

  // 1. Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating once to keep behavior clean
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });

  // 4. Active Nav Link Tracking on Scroll
  const sections = document.querySelectorAll('section');
  const navObserverOptions = {
    threshold: 0.4,
    rootMargin: '-80px 0px -30% 0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // 5. Portfolio Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Manage active state of filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterValue = e.target.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        // Reset element animations
        item.style.transform = 'scale(0.8)';
        item.style.opacity = '0';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            item.classList.remove('hidden');
            // Force reflow
            void item.offsetWidth;
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
          } else {
            item.classList.add('hidden');
          }
        }, 200);
      });
    });
  });

  // 6. Interactive Contact Form Submission Feedback
  const contactForm = document.getElementById('contact-form');
  const feedbackMsg = document.getElementById('form-feedback-msg');
  const submitBtn = document.getElementById('btn-submit-form');

  if (contactForm && feedbackMsg && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Basic local validation checks
      if (!name || !email || !subject || !message) {
        showFeedback('Please fill out all fields correctly.', 'error');
        return;
      }

      // Enter loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        Sending Message...
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      `;

      // Inject spinner animation rules dynamically
      if (!document.getElementById('spinner-style')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'spinner-style';
        styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(styleSheet);
      }

      // Send data to Web3Forms API
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'd620d48f-e694-4e80-9029-67c2fba52f52', // Replace with your Web3Forms Access Key
          name: name,
          email: email,
          subject: subject,
          message: message
        })
      })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200) {
          showFeedback(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you shortly.`, 'success');
          contactForm.reset();
        } else {
          showFeedback(result.message || 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(error => {
        console.error(error);
        showFeedback('Network error. Please check your internet connection and try again.', 'error');
      })
      .finally(() => {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
    });
  }

  function showFeedback(text, type) {
    feedbackMsg.textContent = text;
    feedbackMsg.className = `form-feedback ${type}`;
    
    // Clear feedback block after 5 seconds on success
    if (type === 'success') {
      setTimeout(() => {
        feedbackMsg.style.display = 'none';
      }, 5000);
    }
  }

});
