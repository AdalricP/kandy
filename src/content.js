// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'show_toast') {
        showToast(request.message, request.type);
    }
});

function showToast(text, type = 'success') {
    // Remove existing toast if any
    const existing = document.querySelector('.arxiv-kindle-toast');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = `arxiv-kindle-toast ${type}`;
    toast.textContent = text;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Hide after 3 seconds (or longer for errors)
    if (type !== 'loading') {
        const duration = type === 'error' ? 5000 : 3000;

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300); // waiter for transition
        }, duration);
    }
}
