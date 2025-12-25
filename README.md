# ArXiv to Kindle Downloader

A powerful Chrome extension that automatically downloads ArXiv papers and sends them directly to your Kindle. 

## Features

- **Direct Send**: Sends PDFs from ArXiv directly to your Kindle email.
- **Native Efficiency**: Bypasses download prompts and file system permission issues using a simplified Native Messaging host.
- **Visual Feedback**: Beautiful toast notifications on ArXiv pages indicate status (Sending, Success, Error).
- **Customizable**: Configure your own SMTP sender (Gmail recommended) and Kindle destination.
- **Advanced SMTP**: Support for custom SMTP servers if you don't use Gmail.
- **Shortcuts**: Use `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) to send the current paper.

## Prerequisites

- **Google Chrome** (or Chromium-based browser)
- **Python 3** (installed and in your system PATH)
- **Mac/Linux/Windows** (Bash script included for Mac/Linux, Windows users can adapt the registration steps)

## Installation Guide

### 1. Load the Extension
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `src/` folder from this project repository.
5. **Copy the generated Extension ID** (e.g., `abcdefghijklm...`). You will need this for the next step.

### 2. Register the Native Host
The extension relies on a small Python script to handle the actual downloading and emailing in the background.

1. Open your terminal.
2. Navigate to the project root directory.
3. Run the installation script with your Extension ID:
   ```bash
   ./install_host.sh <YOUR_EXTENSION_ID>
   ```
   *Example: `./install_host.sh abcdefghijklmno...`*

   This script registers the native host manifest with Chrome so the extension can communicate with the Python script.

### 3. Configure Settings
1. Click the extension icon in Chrome (or find it in the puzzle menu) to open **Options**.
2. **Sender Email**: Your email address (e.g., `youremail@gmail.com`).
3. **App Password**: A specific App Password for your email account. 
   - *For Gmail users*: Go to [Google App Passwords](https://myaccount.google.com/apppasswords) to generate one. **Do not use your main account password.**
4. **Kindle Email**: Your Send-to-Kindle email address (e.g., `yourname@kindle.com`).
   - *Tip*: Ensure your Sender Email is approved in your [Amazon Content & Devices](https://www.amazon.com/mycd) preferences.
5. **(Optional) Advanced**: If not using Gmail, toggle "Show Advanced Settings" to configure specific SMTP details.
6. Click **Save Settings**.

## Usage

1. Navigate to any ArXiv paper page (abstract or PDF view).
2. Press **Cmd+Shift+D** (Mac) or **Ctrl+Shift+D** (Windows).
   - Alternatively, use the extension command if you customized it.
3. Watch for the toast notification:
   - **Blue**: Sending...
   - **Green**: Successfully sent to Kindle!
   - **Red**: Error (check your settings).

## Troubleshooting

- **Error: "Native host has exited"**: Ensure Python 3 is installed and `install_host.sh` was run correctly with the matching Extension ID.
- **Email not arriving**: 
  - Check your spam folder.
  - Verify that the "Sender Email" is in your "Approved Personal Document E-mail List" on Amazon.
  - Verify your App Password is correct.
