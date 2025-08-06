// Content script for Workday work history auto-fill
let workHistoryData = [];

// Pre-load work history data immediately
chrome.storage.local.get(['workHistory'], function(result) {
  workHistoryData = result.workHistory || [];
  console.log('Work history data loaded:', workHistoryData.length, 'entries');
  console.log('Work history data:', workHistoryData);
});

// Listen for messages from popup with better error handling
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received:', request);
  if (request.action === 'autoFillWorkHistory') {
    try {
      autoFillWorkHistory();
      // Send response to acknowledge receipt
      sendResponse({success: true, message: 'Auto-fill initiated'});
    } catch (error) {
      console.error('Error in auto-fill:', error);
      sendResponse({success: false, error: error.message});
    }
  }
  // Always return true to keep message channel open for async response
  return true;
});

// Auto-fill work history function
function autoFillWorkHistory() {
  console.log('Starting auto-fill process...');
  console.log('Work history data available:', workHistoryData);
  
  if (workHistoryData.length === 0) {
    alert('No work history data found. Please add your work history in the extension popup first.');
    return;
  }

  // Common selectors for work history fields - expanded for better detection
  const selectors = {
    // Job title fields
    jobTitle: [
      'input[name*="jobTitle"]',
      'input[name*="title"]',
      'input[placeholder*="job title"]',
      'input[placeholder*="title"]',
      'input[id*="jobTitle"]',
      'input[id*="title"]',
      'input[data-automation-id*="job"]',
      'input[data-automation-id*="title"]',
      // Test page specific
      'input[name="jobTitle"]',
      'input[id*="jobTitle"]'
    ],
    
    // Company fields
    company: [
      'input[name*="company"]',
      'input[name*="employer"]',
      'input[placeholder*="company"]',
      'input[placeholder*="employer"]',
      'input[id*="company"]',
      'input[id*="employer"]',
      'input[data-automation-id*="company"]',
      'input[data-automation-id*="employer"]',
      // Test page specific
      'input[name="company"]',
      'input[id*="company"]'
    ],
    
    // Location fields
    location: [
      'input[name*="location"]',
      'input[name*="city"]',
      'input[placeholder*="location"]',
      'input[placeholder*="city"]',
      'input[id*="location"]',
      'input[id*="city"]',
      'input[data-automation-id*="location"]',
      'input[data-automation-id*="city"]',
      // Test page specific
      'input[name="location"]',
      'input[id*="location"]'
    ],
    
    // Start date fields
    startDate: [
      'input[name*="startDate"]',
      'input[name*="from"]',
      'input[placeholder*="start"]',
      'input[placeholder*="from"]',
      'input[id*="startDate"]',
      'input[id*="from"]',
      'input[data-automation-id*="start"]',
      'input[data-automation-id*="from"]',
      // Test page specific
      'input[name="startDate"]',
      'input[id*="startDate"]'
    ],
    
    // End date fields
    endDate: [
      'input[name*="endDate"]',
      'input[name*="to"]',
      'input[name*="until"]',
      'input[placeholder*="end"]',
      'input[placeholder*="to"]',
      'input[id*="endDate"]',
      'input[id*="to"]',
      'input[data-automation-id*="end"]',
      'input[data-automation-id*="to"]',
      // Test page specific
      'input[name="endDate"]',
      'input[id*="endDate"]'
    ],
    
    // Description fields
    description: [
      'textarea[name*="description"]',
      'textarea[name*="responsibilities"]',
      'textarea[placeholder*="description"]',
      'textarea[placeholder*="responsibilities"]',
      'textarea[id*="description"]',
      'textarea[id*="responsibilities"]',
      'textarea[data-automation-id*="description"]',
      'textarea[data-automation-id*="responsibilities"]',
      // Test page specific
      'textarea[name="description"]',
      'textarea[id*="description"]'
    ]
  };

  // Find and fill work history sections
  const workHistorySections = findWorkHistorySections();
  console.log('Found work history sections:', workHistorySections.length);
  
  if (workHistorySections.length === 0) {
    alert('No work history section found on this page. Make sure you are on a Workday job application form.');
    return;
  }

  let filledCount = 0;
  
  // Fill each work history entry
  workHistoryData.forEach((entry, index) => {
    console.log('Processing entry:', entry);
    if (index < workHistorySections.length) {
      const success = fillWorkHistorySection(workHistorySections[index], entry, selectors);
      if (success) filledCount++;
    }
  });

  console.log('Total fields filled:', filledCount);

  // Show success message
  if (filledCount > 0) {
    showNotification(`Successfully filled ${filledCount} work history entries!`, 'success');
  } else {
    showNotification('No fields were filled. Check if you\'re on the correct form section.', 'info');
  }
}

// Find work history sections on the page
function findWorkHistorySections() {
  const sections = [];
  
  // Common patterns for work history sections
  const patterns = [
    // Workday specific patterns
    '[data-automation-id*="work"]',
    '[data-automation-id*="employment"]',
    '[data-automation-id*="experience"]',
    '.work-experience',
    '.employment-history',
    '.experience-section',
    
    // Generic patterns
    'div[class*="work"]',
    'div[class*="employment"]',
    'div[class*="experience"]',
    'section[class*="work"]',
    'section[class*="employment"]',
    'section[class*="experience"]',
    
    // Form sections
    'form div[class*="work"]',
    'form div[class*="employment"]',
    'form div[class*="experience"]',
    
    // More specific Workday patterns
    '[data-automation-id*="job"]',
    '[data-automation-id*="position"]',
    '.job-section',
    '.position-section',
    
    // Test page specific
    '.work-history-section',
    '.work-entry',
    'form'
  ];

  patterns.forEach(pattern => {
    const elements = document.querySelectorAll(pattern);
    console.log(`Pattern "${pattern}" found ${elements.length} elements`);
    elements.forEach(element => {
      if (element.querySelector('input, textarea')) {
        sections.push(element);
      }
    });
  });

  // If no specific sections found, look for any form with work-related fields
  if (sections.length === 0) {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const hasWorkFields = form.querySelector('input[name*="job"], input[name*="company"], input[name*="employer"]');
      if (hasWorkFields) {
        sections.push(form);
      }
    });
  }

  console.log('Final sections found:', sections.length);
  return sections;
}

// Fill a single work history section
function fillWorkHistorySection(section, entry, selectors) {
  let filled = false;
  console.log('Filling section:', section);
  
  // Fill job title
  if (fillField(section, selectors.jobTitle, entry.jobTitle)) {
    console.log('Filled job title:', entry.jobTitle);
    filled = true;
  }
  
  // Fill company
  if (fillField(section, selectors.company, entry.company)) {
    console.log('Filled company:', entry.company);
    filled = true;
  }
  
  // Fill location
  if (entry.location && fillField(section, selectors.location, entry.location)) {
    console.log('Filled location:', entry.location);
    filled = true;
  }
  
  // Fill start date
  if (fillField(section, selectors.startDate, entry.startDate)) {
    console.log('Filled start date:', entry.startDate);
    filled = true;
  }
  
  // Fill end date
  if (entry.endDate && entry.endDate !== 'Present' && fillField(section, selectors.endDate, entry.endDate)) {
    console.log('Filled end date:', entry.endDate);
    filled = true;
  }
  
  // Fill description
  if (entry.description && fillField(section, selectors.description, entry.description)) {
    console.log('Filled description');
    filled = true;
  }
  
  return filled;
}

// Fill a field using multiple selectors
function fillField(section, selectors, value) {
  for (let selector of selectors) {
    const field = section.querySelector(selector);
    if (field && !field.value) {
      console.log(`Filling field with selector "${selector}":`, value);
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }
  return false;
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
    color: white;
    border-radius: 5px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    max-width: 300px;
    word-wrap: break-word;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Auto-detect and fill when page loads (optional)
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for dynamic content to load
  setTimeout(() => {
    const url = window.location.href;
    if (url.includes('workday.com') || url.includes('myworkdayjobs.com')) {
      // Check if we're on a job application page
      const hasWorkHistoryFields = document.querySelector('input[name*="job"], input[name*="company"]');
      if (hasWorkHistoryFields) {
        console.log('Workday job application detected. Ready for auto-fill.');
      }
    }
  }, 1000); // Reduced from 2000ms to 1000ms for faster detection
});

// Notify that content script is ready
console.log('Workday Work History Auto-Fill content script loaded'); 