// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Close alerts
  const closeButtons = document.querySelectorAll('.close-alert');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.style.display = 'none';
    });
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        alert.style.display = 'none';
      }, 500);
    }, 5000);
  });

  // Form validation feedback
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--danger-color)';
        } else {
          field.style.borderColor = 'var(--border-color)';
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields');
      }
    });
  });

  // Animate skill bars on profile page
  const skillBars = document.querySelectorAll('.skill-progress');
  if (skillBars.length > 0) {
    const animateSkills = () => {
      skillBars.forEach(bar => {
        
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
    };

    // Animate on page load
    setTimeout(animateSkills, 300);
  }

  // Image preview for file uploads
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        // Show file name
        const fileName = file.name;
        const label = input.parentElement.querySelector('label');
        if (label) {
          label.textContent = `Selected: ${fileName}`;
        }
      }
    });
  });

  // Confirm delete actions
  const deleteForms = document.querySelectorAll('form[action*="delete"]');
  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!form.querySelector('button[onclick]')) {
        const confirmed = confirm('Are you sure you want to delete this item?');
        if (!confirmed) {
          e.preventDefault();
        }
      }
    });
  });
});