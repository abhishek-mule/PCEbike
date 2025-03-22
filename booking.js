// Initialize Swiper
const swiper = new Swiper('.bike-slider', {
  slidesPerView: 1,
  spaceBetween: 20,
  speed: 800,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      effect: 'slide',
    },
    1024: {
      slidesPerView: 3,
      effect: 'slide',
    },
  },
});

// Initialize Flatpickr for date and time
flatpickr("#bookingDate", {
  minDate: "today",
  maxDate: new Date().fp_incr(30), // Allow booking up to 30 days in advance
  dateFormat: "Y-m-d",
  onChange: function(selectedDates, dateStr) {
    // Update available time slots based on date
    updateTimeSlots(dateStr);
  }
});

// Initialize time picker with custom time slots
flatpickr("#startTime", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  minTime: "08:00",
  maxTime: "20:00",
  minuteIncrement: 30,
  onChange: function(selectedDates, timeStr) {
    // Update duration options based on selected time
    updateDurationOptions(timeStr);
  }
});

function updateTimeSlots(selectedDate) {
  const startTimePicker = document.getElementById('startTime');
  const today = new Date().toISOString().split('T')[0];
  
  if (selectedDate === today) {
    const currentHour = new Date().getHours();
    const minTime = (currentHour < 8) ? "08:00" : 
                   (currentHour >= 20) ? null : 
                   `${currentHour + 1}:00`;
    
    if (minTime) {
      startTimePicker._flatpickr.set('minTime', minTime);
    } else {
      alert('No more bookings available for today. Please select another date.');
      document.getElementById('bookingDate')._flatpickr.clear();
    }
  } else {
    startTimePicker._flatpickr.set('minTime', "08:00");
  }
}

function updateDurationOptions(selectedTime) {
  const durationSelect = document.getElementById('duration');
  const [hours] = selectedTime.split(':').map(Number);
  const maxHours = 20 - hours;
  
  durationSelect.innerHTML = '';
  for (let i = 1; i <= Math.min(4, maxHours); i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} hour${i > 1 ? 's' : ''}`;
    durationSelect.appendChild(option);
  }
}

// Bike Type Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const bikeSlides = document.querySelectorAll('.swiper-slide');

let activeFilter = 'all';

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filterValue = button.getAttribute('data-filter');
    
    if (activeFilter === filterValue) return;
    
    activeFilter = filterValue;

    filterButtons.forEach(btn => {
      if (btn === button) {
        btn.classList.add('active');
        btn.style.transform = 'translateY(-2px) scale(1.05)';
        setTimeout(() => btn.style.transform = 'translateY(-2px) scale(1)', 200);
      } else {
        btn.classList.remove('active');
        btn.style.transform = 'scale(1)';
      }
    });

    bikeSlides.forEach(slide => {
      slide.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      if (filterValue === 'all' || slide.getAttribute('data-type') === filterValue) {
        slide.style.opacity = '0';
        slide.style.transform = 'scale(0.95) translateY(10px)';
        
        setTimeout(() => {
          slide.style.display = 'block';
          requestAnimationFrame(() => {
            slide.style.opacity = '1';
            slide.style.transform = 'scale(1) translateY(0)';
          });
        }, 50);
      } else {
        slide.style.opacity = '0';
        slide.style.transform = 'scale(0.95) translateY(10px)';
        
        setTimeout(() => {
          slide.style.display = 'none';
        }, 500);
      }
    });

    setTimeout(() => {
      swiper.update();
      swiper.slideTo(0);
    }, 550);
  });
});

// Booking Data Store
let bookingData = {
  bike: null,
  personal: null,
  time: null
};

// Progress Chain Navigation
let currentStep = 0;
const progressChain = document.querySelector('.progress-chain');
const steps = document.querySelectorAll('.progress-step');
const sections = {
  bike: document.querySelector('.bike-section'),
  cyclist: document.querySelector('.cyclist-section'),
  time: document.querySelector('.time-section'),
  confirm: document.querySelector('.confirm-section')
};

// Form validation
function validateForm(section) {
  const form = sections[section].querySelector('form');
  if (!form) return true;

  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (input.required && !input.value) {
      isValid = false;
      input.classList.add('error');
      
      // Add shake animation
      input.style.animation = 'shake 0.5s';
      setTimeout(() => {
        input.style.animation = '';
      }, 500);
    } else {
      input.classList.remove('error');
    }

    // Add validation for mobile number
    if (input.id === 'mobile' && input.value) {
      const mobilePattern = /^[0-9]{10}$/;
      if (!mobilePattern.test(input.value)) {
        isValid = false;
        input.classList.add('error');
        alert('Please enter a valid 10-digit mobile number');
      }
    }

    // Add validation for time selection
    if (input.id === 'startTime' && input.value) {
      const [hours] = input.value.split(':').map(Number);
      if (hours < 8 || hours >= 20) {
        isValid = false;
        input.classList.add('error');
        alert('Please select a time between 8:00 AM and 8:00 PM');
      }
    }
  });

  if (!isValid) {
    const firstError = form.querySelector('.error');
    if (firstError) {
      firstError.focus();
    }
  }

  return isValid;
}

function nextStep() {
  if (!validateForm(Object.keys(sections)[currentStep])) {
    return;
  }

  if (currentStep < steps.length - 1) {
    saveCurrentSectionData();
    
    // Animate current section out
    const currentSection = sections[Object.keys(sections)[currentStep]];
    currentSection.style.transition = 'all 0.5s ease';
    currentSection.style.opacity = '0';
    currentSection.style.transform = 'translateX(-100%)';

    steps[currentStep].classList.remove('active');
    steps[currentStep].classList.add('completed');
    currentStep++;
    progressChain.setAttribute('data-step', currentStep);
    
    setTimeout(() => {
      hideAllSections();
      showCurrentSection();
      updateNavigationButtons();
      
      // Animate new section in
      const newSection = sections[Object.keys(sections)[currentStep]];
      newSection.style.transition = 'all 0.5s ease';
      newSection.style.opacity = '1';
      newSection.style.transform = 'translateX(0)';
    }, 500);
    
    setTimeout(() => {
      steps[currentStep].classList.add('active');
      const icon = steps[currentStep].querySelector('.step-icon');
      icon.style.transform = 'scale(1.2)';
      setTimeout(() => icon.style.transform = '', 300);
    }, 300);
  } else if (currentStep === steps.length - 1) {
    if (document.getElementById('termsAccept').checked) {
      submitBooking();
    } else {
      alert('Please accept the terms and conditions to proceed.');
    }
  }
}

function hideAllSections() {
  Object.values(sections).forEach(section => {
    if (section) {
      section.style.display = 'none';
      section.style.opacity = '0';
      section.style.transform = 'translateX(100%)';
    }
  });
}

function showCurrentSection() {
  const sectionKeys = ['bike', 'cyclist', 'time', 'confirm'];
  const currentSection = sections[sectionKeys[currentStep]];
  
  if (currentSection) {
    currentSection.style.display = 'block';
    if (sectionKeys[currentStep] === 'confirm') {
      updateConfirmationSummary();
      startApprovalTimer();
    }
  }
}

function saveCurrentSectionData() {
  const sectionKeys = ['bike', 'cyclist', 'time', 'confirm'];
  const currentSectionKey = sectionKeys[currentStep];
  
  switch (currentSectionKey) {
    case 'bike':
      const activeSlide = document.querySelector('.swiper-slide-active');
      if (activeSlide) {
        bookingData.bike = {
          type: activeSlide.getAttribute('data-type'),
          name: activeSlide.querySelector('h3').textContent,
          price: activeSlide.querySelector('.bike-details span:last-child').textContent
        };
      }
      break;
    case 'cyclist':
      bookingData.personal = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        mobile: document.getElementById('mobile').value,
        address: document.getElementById('address').value,
        college: document.getElementById('collegeName').value,
        erp: document.getElementById('collegeErp').value,
        room: document.getElementById('room').value
      };
      break;
    case 'time':
      const startTime = document.getElementById('startTime').value;
      const duration = parseInt(document.getElementById('duration').value);
      const endTime = calculateEndTime(startTime, duration);
      
      bookingData.time = {
        date: document.getElementById('bookingDate').value,
        startTime: startTime,
        endTime: endTime,
        duration: duration
      };
      break;
  }
}

function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours + duration, minutes);
  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
}

function updateConfirmationSummary() {
  const personalDetails = document.getElementById('personalDetails');
  personalDetails.innerHTML = `
    <p><strong>Name:</strong> ${bookingData.personal.firstName} ${bookingData.personal.lastName}</p>
    <p><strong>Mobile:</strong> ${bookingData.personal.mobile}</p>
    <p><strong>Address:</strong> ${bookingData.personal.address}</p>
    <p><strong>College:</strong> ${bookingData.personal.college}</p>
    <p><strong>ERP:</strong> ${bookingData.personal.erp}</p>
    <p><strong>Room:</strong> ${bookingData.personal.room}</p>
  `;
  
  const bikeDetails = document.getElementById('bikeDetails');
  bikeDetails.innerHTML = `
    <p><strong>Bike Type:</strong> ${bookingData.bike.name}</p>
    <p><strong>Price:</strong> ${bookingData.bike.price}</p>
  `;
  
  const timeDetails = document.getElementById('timeDetails');
  const totalPrice = calculateTotalPrice(bookingData.bike.price, bookingData.time.duration);
  timeDetails.innerHTML = `
    <p><strong>Date:</strong> ${bookingData.time.date}</p>
    <p><strong>Start Time:</strong> ${bookingData.time.startTime}</p>
    <p><strong>End Time:</strong> ${bookingData.time.endTime}</p>
    <p><strong>Duration:</strong> ${bookingData.time.duration} hour(s)</p>
    <p><strong>Total Price:</strong> ${totalPrice}</p>
  `;
}

function calculateTotalPrice(priceStr, duration) {
  const basePrice = parseInt(priceStr.match(/\d+/)[0]);
  return `$${basePrice * duration}/hour`;
}

let approvalTimer;

function startApprovalTimer() {
  const timerElement = document.getElementById('approvalTimer');
  let timeLeft = 15 * 60; // 15 minutes in seconds

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft === 0) {
      clearInterval(approvalTimer);
      alert('Booking time expired. Please try again.');
      window.location.href = 'home.html';
    }
    timeLeft--;
  }

  updateTimer();
  approvalTimer = setInterval(updateTimer, 1000);
}

function updateNavigationButtons() {
  const nextButton = document.querySelector('.btn-primary');
  if (currentStep === steps.length - 1) {
    nextButton.innerHTML = 'Confirm Booking <i class="fas fa-check"></i>';
  } else {
    nextButton.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
  }
}

function submitBooking() {
  clearInterval(approvalTimer);
  
  const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const newBooking = {
    ...bookingData,
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  existingBookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(existingBookings));
  
  // Show success message
  alert('Booking submitted successfully! Redirecting to home page...');
  window.location.href = 'home.html';
}

// Form validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      nextStep();
    }
  });
});

// Add keyup event listeners for real-time validation
document.querySelectorAll('input, select, textarea').forEach(input => {
  input.addEventListener('keyup', () => {
    if (input.classList.contains('error')) {
      if (input.value.trim() !== '') {
        input.classList.remove('error');
      }
    }
  });
});