chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
  
 /* chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "downloadText") {
      const blob = new Blob([request.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: 'extracted_text.txt'
      });
      sendResponse({ success: true });
    }
  });*/
  