// Function to load and display bookings
function loadBookings() {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const activeBookings = document.getElementById('activeBookings');
  const noBookingsSection = document.getElementById('noBookingsSection');
  
  if (bookings.length > 0) {
    activeBookings.innerHTML = bookings.map(booking => `
      <div class="booking-card ${booking.status}">
        <div class="booking-header">
          <h3>${booking.bike.name}</h3>
          <span class="status-badge">${booking.status}</span>
        </div>
        <div class="booking-details">
          <p><i class="fas fa-user"></i> ${booking.personal.firstName} ${booking.personal.lastName}</p>
          <p><i class="fas fa-university"></i> ${booking.personal.college}</p>
          <p><i class="fas fa-calendar"></i> ${booking.time.date}</p>
          <p><i class="fas fa-clock"></i> ${booking.time.startTime} (${booking.time.duration}h)</p>
        </div>
      </div>
    `).join('');
    
    noBookingsSection.style.display = 'none';
    activeBookings.style.display = 'block';
  } else {
    noBookingsSection.style.display = 'block';
    activeBookings.style.display = 'none';
  }
}

// Function to refresh bookings
function refreshBookings() {
  loadBookings();
}

// Load bookings when page loads
document.addEventListener('DOMContentLoaded', loadBookings);