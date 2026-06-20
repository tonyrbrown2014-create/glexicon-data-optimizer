// ==========================================
// 1. THE DECODER (Reading compressed pages)
// ==========================================

const decoderObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentNode;
        
        // Skip code, script, style, and text-input fields
        if (parent && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) {
          const rawText = node.nodeValue.trim();
          
          // Pattern: detects comma-separated numbers (e.g., "128,4,250")
          if (/^\d+(,\d+)*$/.test(rawText)) {
            const coords = rawText.split(',').map(Number);
            const decodedText = glexiconDecode(coords);
            
            // Instantly replace numbers with English text
            node.nodeValue = decodedText;
          }
        }
      }
    });
  });
});

// Start watching the page content the millisecond it loads
decoderObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


// ==========================================
// 2. THE ENCODER (Submitting / Uploading text)
// ==========================================

document.addEventListener('submit', function (event) {
  const form = event.target;
  const textFields = form.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
  
  textFields.forEach(field => {
    let rawText = field.value || field.innerText;
    
    if (rawText && rawText.trim().length > 0) {
      // Convert raw words into coordinates
      const coordinates = glexiconEncode(rawText);
      const compressedPayload = coordinates.join(',');
      
      // Swap out the text for the coordinates right before sending
      if (field.value !== undefined) {
        field.value = compressedPayload;
      } else {
        field.innerText = compressedPayload;
      }
    }
  });
});