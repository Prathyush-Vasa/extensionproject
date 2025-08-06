# Customize Your Work History

## How to Add Your Real Work History

The extension comes with sample work history data. To add your actual work history:

### Option 1: Edit the Files Directly

1. **Edit `popup.js`** (around line 8-35):
   - Find the `presetWorkHistory` array
   - Replace the sample entries with your real work history
   - Format: `{ jobTitle, company, location, startDate, endDate, description, isCurrent }`

2. **Edit `background.js`** (around line 8-35):
   - Find the `presetWorkHistory` array
   - Replace with your real work history (same format)

### Option 2: Use the Extension Popup

1. Load the extension in Chrome
2. Click the extension icon
3. Delete the sample entries using "Remove" buttons
4. Add your real work history using the form
5. Your data will be saved automatically

### Sample Work History Format:

```javascript
{
  jobTitle: "Your Job Title",
  company: "Company Name",
  location: "City, State",
  startDate: "YYYY-MM-DD",
  endDate: "Present", // or "YYYY-MM-DD"
  description: "Your job description and achievements...",
  isCurrent: true // or false
}
```

### After Making Changes:

1. Go to `chrome://extensions/`
2. Find your extension
3. Click the "Reload" button
4. The extension will now use your custom work history

## Tips:

- **Dates**: Use YYYY-MM-DD format (e.g., "2022-01-15")
- **Current Job**: Set `endDate: "Present"` and `isCurrent: true`
- **Descriptions**: Keep them concise but detailed
- **Multiple Jobs**: Add as many entries as you need

The extension will automatically fill all your work history entries when you click "Auto-Fill Current Page" on Workday job applications! 