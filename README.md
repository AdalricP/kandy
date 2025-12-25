# ArXiv to Kindle Downloader

Chrome extension that automatically sends ArXiv papers to your Kindle without download.

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
   - *For Gmail users*: Go to [Google App Passwords](https://myaccount.google.com/apppasswords) to generate one. 
4. **Kindle Email**: Your Send-to-Kindle email address (e.g., `yourname@kindle.com`).
   - *Tip*: Ensure your Sender Email is approved in your [Amazon Content & Devices](https://www.amazon.com/mycd) preferences.
5. **(Optional) Advanced**: If not using Gmail, toggle "Show Advanced Settings" to configure specific SMTP details.
6. Click **Save Settings**.
