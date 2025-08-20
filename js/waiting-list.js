// Enhanced Waiting List Functions - Now redirects to dashboards
function openWaitingList(product) {
    // Direct navigation to dashboards based on product
    if (product === 'V-Zone') {
        // Navigate to V-Zone Dashboard
        window.location.href = 'VZoneDashboard/index.html';
        return;
    } else if (product === 'X-Zone') {
        // Navigate to X-Zone Dashboard
        window.location.href = 'XZoneDashboard/index.html';
        return;
    }
    
    // Fallback for other products - show original waiting list modal
    const modal = document.getElementById('waitingListModal');
    const title = document.getElementById('waitingListTitle');
    const subtitle = document.getElementById('waitingListSubtitle');
    const vzoneCheckbox = document.getElementById('vzoneInterest');
    const xzoneCheckbox = document.getElementById('xzoneInterest');
    
    // Reset form
    document.getElementById('waitingListForm').reset();
    clearValidationErrors();
    
    title.textContent = 'Join the Waiting List';
    subtitle.textContent = 'Be among the first to experience VerifyZone when we launch. Get early access and exclusive benefits!';
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('waitingName').focus();
    }, 300);
    
    // Close on background click
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeWaitingListModal();
        }
    };
}

function closeWaitingListModal() {
    const modal = document.getElementById('waitingListModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    clearValidationErrors();
}

// Form validation functions
function validateWaitingListForm() {
    const form = document.getElementById('waitingListForm');
    const formData = new FormData(form);
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validate name
    const name = formData.get('name').trim();
    if (!name) {
        showFieldError('nameError', 'Please enter your full name');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const email = formData.get('email').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFieldError('emailError', 'Please enter your email address');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    const phone = formData.get('phone').trim();
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone) {
        showFieldError('phoneError', 'Please enter your contact number');
        isValid = false;
    } else if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        showFieldError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate company
    const company = formData.get('company').trim();
    if (!company) {
        showFieldError('companyError', 'Please enter your company name');
        isValid = false;
    }
    
    // Validate interest
    const interests = formData.getAll('interest');
    if (interests.length === 0) {
        showFieldError('interestError', 'Please select at least one product');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    const inputElement = errorElement.previousElementSibling;
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
    inputElement.classList.add('error');
}

function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('.waiting-list-form input');
    
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}

function validateSingleField(input) {
    const name = input.name;
    const value = input.value.trim();
    let errorId = '';
    let errorMessage = '';
    
    switch(name) {
        case 'name':
            errorId = 'nameError';
            if (!value) {
                errorMessage = 'Please enter your full name';
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'email':
            errorId = 'emailError';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Please enter your email address';
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'phone':
            errorId = 'phoneError';
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!value) {
                errorMessage = 'Please enter your contact number';
            } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
            }
            break;
            
        case 'company':
            errorId = 'companyError';
            if (!value) {
                errorMessage = 'Please enter your company name';
            }
            break;
    }
    
    if (errorMessage) {
        showFieldError(errorId, errorMessage);
    } else {
        const errorElement = document.getElementById(errorId);
        errorElement.classList.remove('show');
        input.classList.remove('error');
    }
}

function handleWaitingListSubmission(e) {
    e.preventDefault();
    
    if (!validateWaitingListForm()) {
        return;
    }
    
    const submitBtn = document.getElementById('waitingListSubmit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    
    // Get form data
    const formData = new FormData(e.target);
    const waitingListData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        company: formData.get('company').trim(),
        interests: formData.getAll('interest'),
        timestamp: new Date().toISOString(),
        source: 'waiting-list-modal'
    };
    
    // Simulate API call
    setTimeout(() => {
        // Store in localStorage (for demo purposes)
        storeWaitingListEntry(waitingListData);
        
        // Show success state
        showWaitingListSuccess(waitingListData);
        
        // Reset button
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        
    }, 2000);
}

function storeWaitingListEntry(data) {
    let waitingList = JSON.parse(localStorage.getItem('verifyzone_waiting_list') || '[]');
    waitingList.push(data);
    localStorage.setItem('verifyzone_waiting_list', JSON.stringify(waitingList));
    
    // Also log to console for demo
    console.log('Waiting List Entry:', data);
}

function showWaitingListSuccess(data) {
    const modal = document.querySelector('.waiting-list-modal-content');
    const interests = data.interests.join(' and ');
    
    modal.innerHTML = `
        <div class="waiting-list-success">
            <div class="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                </svg>
            </div>
            <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; margin-right: 8px;">
                    <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4 12L12 16L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4 17L12 21L20 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Welcome to the Waiting List!
            </h3>
            <p>Thank you for joining the ${interests} waiting list! You'll be among the first to know when we launch.</p>
            
            <div class="success-details">
                <h4>What happens next?</h4>
                <p>• You'll receive a confirmation email shortly<br>
                • We'll notify you as soon as ${interests} is available<br>
                • You'll get exclusive early access with special pricing<br>
                • Priority onboarding and support when we launch</p>
            </div>
            
            <button onclick="closeWaitingListModal()" class="btn btn-primary">
                Got it, thanks!
            </button>
        </div>
    `;
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeWaitingListModal();
        showToastMessage(`Successfully joined ${interests} waiting list!`);
    }, 5000);
}

// Initialize waiting list form handlers
document.addEventListener('DOMContentLoaded', function() {
    const waitingListForm = document.getElementById('waitingListForm');
    if (waitingListForm) {
        waitingListForm.addEventListener('submit', handleWaitingListSubmission);
        
        // Real-time validation
        const inputs = document.querySelectorAll('.waiting-list-form input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateSingleField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateSingleField(this);
                }
            });
        });
    }
});
