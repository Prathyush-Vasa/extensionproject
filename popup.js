document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('workHistoryForm');
  const workHistoryList = document.getElementById('workHistoryList');
  const clearAllBtn = document.getElementById('clearAll');
  const autoFillBtn = document.getElementById('autoFillBtn');
  const currentJobCheckbox = document.getElementById('currentJob');
  const endDateInput = document.getElementById('endDate');

  // Preset work history data - ADD YOUR ACTUAL WORK HISTORY HERE
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

  // Initialize with preset data if no existing data
  initializeWithPresetData();

  // Handle current job checkbox
  currentJobCheckbox.addEventListener('change', function() {
    endDateInput.disabled = this.checked;
    if (this.checked) {
      endDateInput.value = '';
    }
  });

  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const workEntry = {
      jobTitle: document.getElementById('jobTitle').value,
      company: document.getElementById('company').value,
      location: document.getElementById('location').value,
      startDate: document.getElementById('startDate').value,
      endDate: currentJobCheckbox.checked ? 'Present' : document.getElementById('endDate').value,
      description: document.getElementById('description').value,
      isCurrent: currentJobCheckbox.checked
    };

    addWorkHistory(workEntry);
    form.reset();
    currentJobCheckbox.checked = false;
    endDateInput.disabled = false;
  });

  // Clear all work history
  clearAllBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all work history entries?')) {
      chrome.storage.local.remove(['workHistory'], function() {
        loadWorkHistory();
      });
    }
  });

  // Auto-fill current page with better error handling
  autoFillBtn.addEventListener('click', function() {
    // First, get the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length === 0) {
        alert('No active tab found. Please make sure you are on a page with form fields.');
        return;
      }

      const currentTab = tabs[0];
      
      // Allow testing on any page, not just Workday
      console.log('Attempting to auto-fill on:', currentTab.url);

      // Try to send message to content script
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'autoFillWorkHistory'
      }, function(response) {
        // Handle response or error
        if (chrome.runtime.lastError) {
          console.log('Content script not ready, injecting...');
          
          // Inject content script and try again
          chrome.scripting.executeScript({
            target: {tabId: currentTab.id},
            files: ['content.js']
          }, function() {
            // Wait a moment for script to load, then try again
            setTimeout(function() {
              chrome.tabs.sendMessage(currentTab.id, {
                action: 'autoFillWorkHistory'
              }, function(response) {
                if (chrome.runtime.lastError) {
                  alert('Unable to auto-fill. Please refresh the page and try again.');
                }
              });
            }, 500);
          });
        }
      });
    });
  });

  // Initialize with preset data
  function initializeWithPresetData() {
    chrome.storage.local.get(['workHistory', 'initialized'], function(result) {
      if (!result.initialized) {
        // First time loading - use preset data
        chrome.storage.local.set({
          workHistory: presetWorkHistory,
          initialized: true
        }, function() {
          loadWorkHistory();
        });
      } else {
        // Already initialized - load existing data
        loadWorkHistory();
      }
    });
  }
});

function addWorkHistory(workEntry) {
  chrome.storage.local.get(['workHistory'], function(result) {
    const workHistory = result.workHistory || [];
    workHistory.push(workEntry);
    
    chrome.storage.local.set({workHistory: workHistory}, function() {
      loadWorkHistory();
    });
  });
}

function loadWorkHistory() {
  chrome.storage.local.get(['workHistory'], function(result) {
    const workHistory = result.workHistory || [];
    
    if (workHistory.length === 0) {
      workHistoryList.innerHTML = '<p style="text-align: center; color: #999;">No work history entries yet</p>';
      return;
    }

    workHistoryList.innerHTML = '';
    workHistory.forEach((entry, index) => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'work-entry';
      
      const dateRange = entry.isCurrent ? 
        `${entry.startDate} - Present` : 
        `${entry.startDate} - ${entry.endDate}`;

      entryDiv.innerHTML = `
        <h4>${entry.jobTitle}</h4>
        <p><strong>${entry.company}</strong>${entry.location ? ` - ${entry.location}` : ''}</p>
        <p>${dateRange}</p>
        ${entry.description ? `<p>${entry.description.substring(0, 100)}${entry.description.length > 100 ? '...' : ''}</p>` : ''}
        <button class="btn btn-danger" onclick="removeWorkEntry(${index})" style="font-size: 10px; padding: 5px 10px;">Remove</button>
      `;
      
      workHistoryList.appendChild(entryDiv);
    });
  });
}

function removeWorkEntry(index) {
  chrome.storage.local.get(['workHistory'], function(result) {
    const workHistory = result.workHistory || [];
    workHistory.splice(index, 1);
    
    chrome.storage.local.set({workHistory: workHistory}, function() {
      loadWorkHistory();
    });
  });
} 