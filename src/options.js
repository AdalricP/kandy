document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('shortcuts-link').addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

document.getElementById('advanced-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    const advancedDiv = document.getElementById('advanced-settings');
    const toggleLink = document.getElementById('advanced-toggle');

    if (advancedDiv.style.display === 'none') {
        advancedDiv.style.display = 'block';
        toggleLink.textContent = 'Hide Advanced Settings';
    } else {
        advancedDiv.style.display = 'none';
        toggleLink.textContent = 'Show Advanced Settings';
    }
});

function saveOptions() {
    const gmail = document.getElementById('gmail').value;
    const password = document.getElementById('password').value;
    const smtp_host = document.getElementById('smtp_host').value || 'smtp.gmail.com';
    const smtp_port = document.getElementById('smtp_port').value || '465';
    const kindle = document.getElementById('kindle').value;

    chrome.storage.local.set({
        gmail: gmail,
        password: password,
        smtp_host: smtp_host,
        smtp_port: smtp_port,
        kindle: kindle
    }, function () {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 2000);
    });
}

function restoreOptions() {
    chrome.storage.local.get({
        gmail: '',
        password: '',
        smtp_host: 'smtp.gmail.com',
        smtp_port: '465',
        kindle: ''
    }, function (items) {
        document.getElementById('gmail').value = items.gmail;
        document.getElementById('password').value = items.password;
        document.getElementById('smtp_host').value = items.smtp_host;
        document.getElementById('smtp_port').value = items.smtp_port;
        document.getElementById('kindle').value = items.kindle;
    });
}
