# Workday Work History Auto-Fill Extension

A browser extension that automatically fills in your work history on Workday job application forms, saving you time from repeatedly copying and pasting the same information.

## Features

- **Store Work History**: Add and manage your work history entries through a user-friendly popup interface
- **Auto-Fill Forms**: Automatically fill Workday job application forms with your stored work history
- **Multiple Entries**: Support for multiple work history entries
- **Current Job Support**: Mark jobs as current with "Present" end date
- **Secure Storage**: All data is stored locally in your browser

## Installation

### For Chrome/Edge:

1. **Download the Extension Files**
   - Download all the files in this folder to a directory on your computer

2. **Load the Extension**
   - Open Chrome/Edge and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the folder containing the extension files

3. **Verify Installation**
   - The extension should appear in your extensions list
   - You should see the extension icon in your browser toolbar

## Usage

### Adding Work History

1. **Click the Extension Icon**
   - Click the extension icon in your browser toolbar to open the popup

2. **Add Your Work History**
   - Fill in the form with your job details:
     - Job Title
     - Company
     - Location (optional)
     - Start Date
     - End Date (or check "Currently working here")
     - Job Description (optional)

3. **Save Entries**
   - Click "Add Work History" to save each entry
   - You can add multiple work history entries

### Auto-Filling Workday Forms

1. **Navigate to Workday Job Application**
   - Go to any Workday job application page
   - Navigate to the work history/employment section

2. **Trigger Auto-Fill**
   - Click the extension icon
   - Click "Auto-Fill Current Page" button
   - The extension will automatically fill in the work history fields

3. **Verify and Submit**
   - Review the filled information
   - Make any necessary adjustments
   - Submit your application

## Supported Websites

This extension is specifically designed to work with:
- `*.workday.com`
- `*.myworkdayjobs.com`

## File Structure

```
JobApplicationExtension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── content.js            # Content script for auto-filling
├── background.js         # Background service worker
├── icons/                # Extension icons (you'll need to add these)
└── README.md            # This file
```

## Adding Icons

To complete the extension, you'll need to add icon files to the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

You can create simple icons or use any image editing software to create them.

## Privacy & Security

- **Local Storage**: All work history data is stored locally in your browser
- **No Data Sharing**: The extension doesn't send any data to external servers
- **Secure**: Your work history information stays on your device

## Troubleshooting

### Extension Not Working
1. Make sure you're on a Workday job application page
2. Check that the extension is enabled in `chrome://extensions/`
3. Try refreshing the page and clicking the auto-fill button again

### Fields Not Being Filled
1. Ensure you've added work history entries in the popup
2. Check that you're on the correct work history section of the form
3. Some Workday forms may have different field names - the extension tries multiple common patterns

### Permission Issues
- The extension needs permissions to access Workday websites
- If prompted, allow the extension to access the current page

## Development

To modify or enhance the extension:

1. **Edit the Files**: Modify the JavaScript, HTML, or CSS files as needed
2. **Reload Extension**: Go to `chrome://extensions/` and click the reload button
3. **Test Changes**: Test on a Workday job application page

## Support

If you encounter issues or have suggestions for improvements, please check:
1. That you're using a supported browser (Chrome, Edge, or other Chromium-based browsers)
2. That you're on a Workday job application page
3. That you've added work history entries before trying to auto-fill

## License

This extension is provided as-is for personal use. Feel free to modify and distribute as needed. 