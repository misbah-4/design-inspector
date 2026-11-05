// Toolbar click (or Alt+Shift+I) injects the inspector; injecting again toggles it off.
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || /^(chrome|edge|about|chrome-extension|devtools):/.test(tab.url || '')) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  } catch (err) {
    console.warn('Design Inspector cannot run on this page:', err);
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.type === 'di-state' && sender.tab?.id) {
    chrome.action.setBadgeText({ tabId: sender.tab.id, text: msg.active ? 'ON' : '' });
    chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: '#7C5CE0' });
  }
});
