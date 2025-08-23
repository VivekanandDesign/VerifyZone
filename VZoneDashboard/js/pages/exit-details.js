/**
 * Exit Details Page JavaScript
 * Handles form validation, submission, and interactions
 */

class ExitDetailsManager {
    constructor() {
        this.form = document.getElementById('exitDetailsForm');
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupInteractions();
        this.loadEmployeeData();
    }

    setupFormValidation() {
        // Real-time validation for required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });

        // Employee ID lookup
        const employeeIdField = document.getElementById('employeeId');
        employeeIdField.addEventListener('blur', () => {
            this.lookupEmployee(employeeIdField.value);
        });
    }

    setupFormSubmission() {
        // Save button
        document.getElementById('saveExitDetails').addEventListener('click', () => {
            this.saveAsDraft();
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    setupInteractions() {
        // Exit type change handler
        document.getElementById('exitType').addEventListener('change', (e) => {
            this.handleExitTypeChange(e.target.value);
        });

        // Date validation
        document.getElementById('lastWorkingDay').addEventListener('change', (e) => {
            this.validateDate(e.target.value);
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Specific field validations
        switch (field.id) {
            case 'employeeId':
                if (value && !this.isValidEmployeeId(value)) {
                    isValid = false;
                    errorMessage = 'Invalid employee ID format';
                }
                break;
            case 'lastWorkingDay':
                if (value && !this.isValidDate(value)) {
                    isValid = false;
                    errorMessage = 'Invalid date or date in the past';
                }
                break;
            case 'noticePeriod':
                if (value && (parseInt(value) < 0 || parseInt(value) > 365)) {
                    isValid = false;
                    errorMessage = 'Notice period must be between 0 and 365 days';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        this.clearFieldError(field);
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    isValidEmployeeId(employeeId) {
        // Format: EMP followed by 4-6 digits
        const pattern = /^EMP\d{4,6}$/i;
        return pattern.test(employeeId);
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return date instanceof Date && !isNaN(date) && date >= today;
    }

    lookupEmployee(employeeId) {
        if (!employeeId || !this.isValidEmployeeId(employeeId)) {
            return;
        }

        // Simulate employee lookup
        this.showLoading('Looking up employee...');
        
        setTimeout(() => {
            const mockEmployeeData = {
                'EMP1001': {
                    name: 'John Smith',
                    department: 'it',
                    designation: 'Senior Software Engineer'
                },
                'EMP1002': {
                    name: 'Sarah Johnson',
                    department: 'hr',
                    designation: 'HR Manager'
                },
                'EMP1003': {
                    name: 'Mike Wilson',
                    department: 'finance',
                    designation: 'Financial Analyst'
                }
            };

            const employee = mockEmployeeData[employeeId.toUpperCase()];
            if (employee) {
                this.populateEmployeeData(employee);
                this.showSuccess('Employee found and data populated');
            } else {
                this.showError('Employee not found in system');
            }
            
            this.hideLoading();
        }, 1500);
    }

    populateEmployeeData(employee) {
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('department').value = employee.department;
        document.getElementById('designation').value = employee.designation;
    }

    handleExitTypeChange(exitType) {
        const reasonCategory = document.getElementById('reasonCategory');
        const noticePeriod = document.getElementById('noticePeriod');
        
        // Set default notice period based on exit type
        switch (exitType) {
            case 'resignation':
                noticePeriod.value = '30';
                break;
            case 'termination':
                noticePeriod.value = '0';
                break;
            case 'retirement':
                noticePeriod.value = '60';
                break;
            case 'contract-end':
                noticePeriod.value = '0';
                break;
        }

        // Filter reason categories based on exit type
        this.updateReasonCategories(exitType);
    }

    updateReasonCategories(exitType) {
        const reasonCategory = document.getElementById('reasonCategory');
        const options = reasonCategory.querySelectorAll('option[value!=""]');
        
        options.forEach(option => {
            option.style.display = 'block';
        });

        // Hide irrelevant options based on exit type
        if (exitType === 'termination') {
            options.forEach(option => {
                if (['better-opportunity', 'personal-reasons', 'relocation'].includes(option.value)) {
                    option.style.display = 'none';
                }
            });
        }
    }

    validateDate(dateString) {
        if (!this.isValidDate(dateString)) {
            const field = document.getElementById('lastWorkingDay');
            this.showFieldError(field, 'Last working day cannot be in the past');
            return false;
        }
        return true;
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Add timestamp
        data.submittedAt = new Date().toISOString();
        data.submittedBy = 'current-user'; // Replace with actual user data

        return data;
    }

    saveAsDraft() {
        const data = this.collectFormData();
        data.status = 'draft';

        this.showLoading('Saving draft...');

        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('exitDetailsDraft', JSON.stringify(data));
            this.hideLoading();
            this.showSuccess('Draft saved successfully');
        }, 1000);
    }

    submitForm() {
        if (!this.validateForm()) {
            this.showError('Please fix the errors before submitting');
            return;
        }

        const data = this.collectFormData();
        data.status = 'submitted';
        data.referenceId = this.generateReferenceId();

        this.showLoading('Submitting exit details...');

        // Simulate API submission
        setTimeout(() => {
            // Clear draft
            localStorage.removeItem('exitDetailsDraft');
            
            this.hideLoading();
            this.showSubmissionSuccess(data.referenceId);
        }, 2000);
    }

    generateReferenceId() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        return `EX-${year}${month}${day}-${random}`;
    }

    showSubmissionSuccess(referenceId) {
        document.getElementById('referenceId').textContent = referenceId;
        document.getElementById('successModal').classList.add('active');
    }

    loadEmployeeData() {
        // Load draft data if exists
        const draft = localStorage.getItem('exitDetailsDraft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                this.populateFormWithData(data);
                this.showInfo('Draft data loaded');
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }

    populateFormWithData(data) {
        Object.keys(data).forEach(key => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    if (Array.isArray(data[key])) {
                        data[key].forEach(value => {
                            const checkbox = this.form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }
                } else {
                    field.value = data[key];
                }
            }
        });
    }

    showLoading(message) {
        // Create or update loading overlay
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        overlay.style.display = 'flex';
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.exitDetailsManager = new ExitDetailsManager();
});

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    background: #28a745;
}

.notification-error {
    background: #dc3545;
}

.notification-info {
    background: #9967d1;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(54, 25, 104, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(5px);
}

.loading-content {
    text-align: center;
    color: white;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #9967d1;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-message {
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);
