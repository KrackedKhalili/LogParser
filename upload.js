function uploadFile() {
  const input = document.getElementById('fileInput');
  if (input.files.length > 0) {
    const file = input.files[0];
    if (file.type === "text/plain" || file.name.endsWith('.log')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('fileContent').innerText = content;
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid text or log file.');
    }
  } else {
    alert('Please select a file to upload.');
  }
}


function searchText() {
  const searchInput = document.getElementById('searchInput').value;
  const fileContentDiv = document.getElementById('fileContent');
  const content = fileContentDiv.innerText;
  if (!searchInput.trim()) {
    fileContentDiv.innerHTML = content; // reset to plain text if search input is empty
    alert('Please enter a text to search.');
    return;
  }
  const regex = new RegExp(`(${searchInput})`, 'gi');
  const lines = content.split('\n');
  let result = '';
  lines.forEach(line => {
    if (line.match(regex)) {
      result += line.replace(regex, '<span style="background-color: yellow;">$1</span>') + '\n';
    }
  });
  fileContentDiv.innerHTML = result || 'No matches found.';
}

function exportMatches() {
  const fileContentDiv = document.getElementById('fileContent');
  const textToSave = fileContentDiv.innerText;
  if (textToSave === 'No matches found.' || textToSave === '') {
    alert('No matches to export.');
    return;
  }
  const blob = new Blob([textToSave], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.download = 'matched_text.txt';
  anchor.href = window.URL.createObjectURL(blob);
  anchor.click();
  window.URL.revokeObjectURL(anchor.href);
}

function detectIPAddresses() {
  const fileContentDiv = document.getElementById('fileContent');
  const content = fileContentDiv.innerText;
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g; // Regex to detect IP addresses
  const ipCountDiv = document.getElementById('ipCount');

  const lines = content.split('\n');
  let lineNumber = 1;
  const ipCountMap = new Map();
  lines.forEach(line => {
    const ipMatches = line.match(ipRegex);
    if (ipMatches) {
      ipMatches.forEach(ip => {
        if (!ipCountMap.has(ip)) {
          ipCountMap.set(ip, []);
        }
        if (!ipCountMap.get(ip).includes(lineNumber)) {
          ipCountMap.get(ip).push(lineNumber);
        }
      });
    }
    lineNumber++;
  });

  const uniqueIPs = Array.from(ipCountMap.keys());

  if (uniqueIPs.length > 0) {
    let ipListHTML = '<p>Total unique IP addresses found: ' + uniqueIPs.length + '</p>';
    ipListHTML += '<p>IP Addresses:</p>';
    ipListHTML += '<ul>';
    uniqueIPs.forEach(ip => {
      const count = ipCountMap.get(ip).length;
      ipListHTML += `<li>${ip}: ${count} times (Found in lines: ${ipCountMap.get(ip).join(', ')})</li>`;
    });
    ipListHTML += '</ul>';
    ipCountDiv.innerHTML = ipListHTML;
  } else {
    ipCountDiv.innerText = 'No IP addresses found.';
  }
}
