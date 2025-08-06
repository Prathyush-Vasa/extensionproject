// Background service worker for Workday Work History Auto-Fill extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    console.log('Workday Work History Auto-Fill extension installed');
    
    // Initialize storage with preset work history data
    const presetWorkHistory = [
      {
        jobTitle: "Software Engineer",
        company: "Tech Company Inc.",
        location: "San Francisco, CA",
        startDate: "2022-01-15",
        endDate: "Present",
        description: "Developed full-stack web applications using React, Node.js, and PostgreSQL. Led team of 3 developers and improved application performance by 40%.",
        isCurrent: true
      },
      {
        jobTitle: "Junior Developer",
        company: "StartupXYZ",
        location: "New York, NY",
        startDate: "2020-06-01",
        endDate: "2021-12-31",
        description: "Built responsive web applications and REST APIs. Collaborated with design team to implement user-friendly interfaces.",
        isCurrent: false
      },
      {
        jobTitle: "Web Developer Intern",
        company: "Digital Agency",
        location: "Los Angeles, CA",
        startDate: "2019-05-01",
        endDate: "2020-05-31",
        description: "Assisted in front-end development using HTML, CSS, and JavaScript. Created interactive components and maintained client websites.",
        isCurrent: false
      }
    ];
    
    chrome.storage.local.set({
      workHistory: presetWorkHistory,
      initialized: true
    }, function() {
      console.log('Storage initialized with preset work history');
    });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getWorkHistory') {
    chrome.storage.local.get(['workHistory'], function(result) {
      sendResponse({workHistory: result.workHistory || []});
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'saveWorkHistory') {
    chrome.storage.local.set({workHistory: request.workHistory}, function() {
      sendResponse({success: true});
    });
    return true;
  }
});

// Handle tab updates to detect Workday pages - optimized for speed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('workday.com') || tab.url.includes('myworkdayjobs.com')) {
      // Inject content script immediately for faster loading
      chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
      }).catch(() => {
        // Script might already be injected, ignore error
      });
    }
  }
});

// Pre-load work history data for faster access
chrome.storage.local.get(['workHistory'], function(result) {
  if (result.workHistory) {
    console.log('Work history data pre-loaded:', result.workHistory.length, 'entries');
  }
}); 