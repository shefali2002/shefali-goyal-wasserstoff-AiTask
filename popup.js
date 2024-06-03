document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const queryInput = document.getElementById('query');
    const askButton = document.getElementById('askButton');
    const responseLabel = document.getElementById('responseLabel'); // Add this line
    const saveButton = document.getElementById('saveButton');
    let textContent = '';
  
    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener((message) => {
      textContent = message.text;
      contentDiv.textContent = textContent;
      // Save text content to local storage
      chrome.storage.local.set({ pageContent: textContent });
    });
  
    // Handle the ask button click
    askButton.addEventListener('click', () => {
      const query = queryInput.value;
      fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      })
      .then(response => response.json())
      .then(data => {
        // Append the new response to the responseDiv
        const responseText = document.createElement('div');
        responseText.textContent = `Q: ${query}\nA: ${data.response}`;
        responseText.style.marginBottom = '10px';
  
        // Insert the responseText element near the responseLabel
        responseLabel.insertAdjacentElement('afterend', responseText);
      });
    });
  
    // Handle the save button click
    saveButton.addEventListener('click', () => {
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
        suggest({filename: 'page-content.txt', conflictAction: 'overwrite'});
    });
    // Download the file
    chrome.downloads.download({
        url: url
      });
    });
  
    // Extract text content when the popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
    });
  });
  