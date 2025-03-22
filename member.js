// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
  const membershipForm = document.getElementById('membershipForm');
  const planCards = document.querySelectorAll('.membership-card');
  let selectedPlan = null;

  // Plan selection
  planCards.forEach(card => {
    const selectBtn = card.querySelector('.btn');
    selectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedPlan = card.querySelector('.plan-name').textContent;
      
      // Update UI for selected plan
      planCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      // Scroll to registration form
      document.getElementById('registrationSection').scrollIntoView({ behavior: 'smooth' });
      
      // Update form with selected plan
      document.getElementById('selectedPlan').value = selectedPlan;
    });
  });

  // Form submission
  membershipForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      Swal.fire({
        icon: 'error',
        title: 'Please select a plan',
        text: 'You must choose a membership plan before registering.'
      });
      return;
    }

    // Basic form validation
    const requiredFields = ['fullName', 'email', 'phone', 'college', 'studentId'];
    let isValid = true;

    requiredFields.forEach(field => {
      const input = document.getElementById(field);
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });

    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Please fill all required fields',
        text: 'All fields marked with * are required.'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(document.getElementById('email').value)) {
      document.getElementById('email').classList.add('error');
      Swal.fire({
        icon: 'error',
        title: 'Invalid email',
        text: 'Please enter a valid email address.'
      });
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(document.getElementById('phone').value)) {
      document.getElementById('phone').classList.add('error');
      Swal.fire({
        icon: 'error',
        title: 'Invalid phone number',
        text: 'Please enter a valid 10-digit phone number.'
      });
      return;
    }

    // Simulate form submission
    try {
      const submitButton = membershipForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store in localStorage for demo purposes
      const formData = {
        plan: selectedPlan,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        college: document.getElementById('college').value,
        studentId: document.getElementById('studentId').value,
        registrationDate: new Date().toISOString(),
        status: 'pending'
      };

      const memberships = JSON.parse(localStorage.getItem('memberships') || '[]');
      memberships.push(formData);
      localStorage.setItem('memberships', JSON.stringify(memberships));

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Your membership application has been submitted. We will contact you shortly.',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reset form and UI
        membershipForm.reset();
        planCards.forEach(card => card.classList.remove('selected'));
        selectedPlan = null;
        
        // Redirect to home page
        window.location.href = 'home.html';
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'There was an error processing your registration. Please try again.'
      });
    } finally {
      const submitButton = membershipForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.innerHTML = 'Complete Registration';
    }
  });

  // Real-time validation
  membershipForm.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
      }
    });
  });
});

// FAQ Accordion functionality
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
      const answer = item.querySelector('.faq-answer');
      answer.style.maxHeight = null;
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
      const answer = faqItem.querySelector('.faq-answer');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Animate requirement cards on scroll
const observerOptions = {
  threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.requirement-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.5s ease-out';
  observer.observe(card);
});