(function() {
    // Extract text content from the body of the page
    const textContent = document.body.innerText;
  
    // Send the extracted text to the popup
    chrome.runtime.sendMessage({ text: textContent });
  
    // Function to save page content
    //function savePageContent(content) {
      //chrome.storage.local.get('pageContent', (data) => {
        //if (data.pageContent) {
          // If content already exists, delete current content
          //chrome.storage.local.remove('pageContent', () => {
            // Add latest content
            //chrome.storage.local.set({ pageContent: content });
          //});
        //} else {
          // If content does not exist, add it
          //chrome.storage.local.set({ pageContent: content });
        //}
      //});
    //}
  
    // Save the extracted text content
    savePageContent(textContent);
  })();
  