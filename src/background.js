chrome.commands.onCommand.addListener((command) => {
  if (command === "download_pdf") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url) {
        processTab(tab);
      }
    });
  }
});

function processTab(tab) {
  try {
    const url = new URL(tab.url);
    if (url.hostname === 'arxiv.org') {
      let pdfUrl = '';
      let filenamePart = '';

      if (url.pathname.startsWith('/abs/')) {
        const pdfPath = url.pathname.replace('/abs/', '/pdf/');
        pdfUrl = `https://arxiv.org${pdfPath}`;
        filenamePart = pdfPath.split('/').pop();
      } else if (url.pathname.startsWith('/pdf/')) {
        pdfUrl = tab.url;
        filenamePart = url.pathname.split('/').pop();
      }

      if (pdfUrl) {
        // Ensure ends with .pdf
        if (!pdfUrl.endsWith('.pdf')) {
          pdfUrl += '.pdf';
          filenamePart += '.pdf'; // filename needs extension too? relying on previous code logic
        }
        // Clean filenamePart just in case
        filenamePart = filenamePart.replace('.pdf.pdf', '.pdf');

        console.log(`Triggering Kindle send for URL: ${pdfUrl}`);
        triggerNativeMessage(pdfUrl, `arxiv_${filenamePart}`, tab.id);
      } else {
        console.log("Not an ArXiv abstract or PDF page.");
      }
    }

  } catch (e) {
    console.error("Error parsing URL or triggering download:", e);
  }
}

function triggerNativeMessage(url, filename, tabId) {
  chrome.storage.local.get({
    gmail: '',
    password: '',
    smtp_host: 'smtp.gmail.com',
    smtp_port: '465',
    kindle: ''
  }, function (items) {
    if (!items.gmail || !items.password || !items.kindle) {
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { action: 'show_toast', message: 'Credentials missing in options!', type: 'error' });
      }
      return;
    }

    const message = {
      type: "download_and_send",
      url: url,
      filename: filename,
      sender_email: items.gmail,
      sender_password: items.password,
      smtp_host: items.smtp_host,
      smtp_port: items.smtp_port,
      kindle_email: items.kindle
    };

    // 1. Notify start
    if (tabId) {
      chrome.tabs.sendMessage(tabId, { action: 'show_toast', message: 'Sending to Kindle', type: 'loading' });
    }

    console.log("Sending Native Message to host...", message);
    chrome.runtime.sendNativeMessage('com.antigravity.arxiv_downloader', message,
      function (response) {
        if (chrome.runtime.lastError) {
          console.error("Native Messaging Error:", chrome.runtime.lastError.message);
          if (tabId) {
            chrome.tabs.sendMessage(tabId, { action: 'show_toast', message: `Error: ${chrome.runtime.lastError.message}`, type: 'error' });
          }
        } else {
          console.log("Received response from Native Host:", response);

          if (response && response.status === 'success') {
            if (tabId) {
              chrome.tabs.sendMessage(tabId, { action: 'show_toast', message: 'Check your Kindle! :)', type: 'success' });
            }
          } else {
            if (tabId) {
              chrome.tabs.sendMessage(tabId, { action: 'show_toast', message: `Failed: ${(response && response.message) ? response.message : "Unknown error"}`, type: 'error' });
            }
          }
        }
      }
    );
  });
}

