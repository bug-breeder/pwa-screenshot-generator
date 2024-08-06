
document.getElementById('openBrowserButton').addEventListener('click', async () => {
  const device = document.getElementById('deviceSelect').value;
  const url = document.getElementById('urlInput').value;

  if (!url) {
    alert('Please enter a valid URL');
    return;
  }

  // Send the device and URL to the backend to open the browser
  const response = await fetch('/open-browser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ device, url })
  });

  if (response.ok) {
    document.getElementById('screenshotField').style.display = 'block';
  } else {
    alert('Failed to open browser');
  }
});

document.getElementById('screenshotButton').addEventListener('click', async () => {
  // Send a request to take a screenshot
  const response = await fetch('/take-screenshot', {
    method: 'POST'
  });

  if (response.ok) {
    alert('Screenshot taken successfully');
  } else {
    alert('Failed to take screenshot');
  }
});
