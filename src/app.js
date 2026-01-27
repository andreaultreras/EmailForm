// =========================
// CONFIG
// =========================
const GOOGLE_CIVIC_API_KEY = 'YOUR_API_KEY_HERE';

// =========================
// DOM ELEMENTS
// =========================
const zipInput = document.getElementById('zip');
const lookupBtn = document.getElementById('lookupBtn');
const errorDiv = document.getElementById('error');
const resultsDiv = document.getElementById('results');

// =========================
// HELPERS
// =========================
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function clearError() {
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
}

function clearResults() {
  resultsDiv.innerHTML = '';
}

function isValidZip(zip) {
  return /^\d{5}$/.test(zip);
}

// =========================
// API CALL
// =========================
async function lookupRepresentatives(zip) {
  const url = new URL('https://www.googleapis.com/civicinfo/v2/representatives');
  url.searchParams.set('key', GOOGLE_CIVIC_API_KEY);
  url.searchParams.set('address', zip);
  url.searchParams.set('levels', 'country');
  url.searchParams.set('roles', 'legislatorUpperBody');
  url.searchParams.append('roles', 'legislatorLowerBody');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}

// =========================
// RENDERING
// =========================
function renderRepresentatives(data) {
  const offices = data.offices || [];
  const officials = data.officials || [];

  if (!offices.length) {
    showError('No representatives found for this ZIP code.');
    return;
  }

  offices.forEach(office => {
    office.officialIndices.forEach(index => {
      const official = officials[index];
      if (!official) return;

      const div = document.createElement('div');
      div.className = 'rep';

      div.innerHTML = `
        <h3>${official.name}</h3>
        <p><strong>${office.name}</strong></p>
        ${official.emails ? `<p>Email: ${official.emails[0]}</p>` : ''}
        ${official.phones ? `<p>Phone: ${official.phones[0]}</p>` : ''}
      `;

      resultsDiv.appendChild(div);
    });
  });
}

// =========================
// EVENT HANDLER
// =========================
lookupBtn.addEventListener('click', async () => {
  clearError();
  clearResults();

  const zip = zipInput.value.trim();

  if (!isValidZip(zip)) {
    showError('Please enter a valid 5-digit ZIP code.');
    return;
  }

  lookupBtn.disabled = true;
  lookupBtn.textContent = 'Looking up…';

  try {
    const data = await lookupRepresentatives(zip);
    renderRepresentatives(data);
  } catch (err) {
    console.error(err);
    showError('Unable to look up representatives. Please try again.');
  } finally {
    lookupBtn.disabled = false;
    lookupBtn.textContent = 'Find My Representatives';
  }
});
