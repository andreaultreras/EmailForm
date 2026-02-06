// =================
// DOM Elements
// =================
const zipInput = document.getElementById('zip');
const nameInput = document.getElementById('name');
const lookUpBtn = document.getElementById('lookUpBtn');
const zipErrorDiv = document.getElementById('zipError');
const nameErrorDiv = document.getElementById('nameError');

// ==================
// HELPERS
// ==================
function isValidZip(zip) {
  return /^\d{5}$/.test(zip);
}

function showZipError(message) {
  zipErrorDiv.textContent = message;
  zipErrorDiv.style.display = "block";
}

function showNameError(message) {
  nameErrorDiv.textContent = message;
  nameErrorDiv.style.display = "block";
}

function clearError() {
  zipErrorDiv.textContent = '';
  zipErrorDiv.style.display = 'none';
  
  nameErrorDiv.textContent = '';
  nameErrorDiv.style.display = "none";
}

function showEmailForm() {
  const emailForm = document.querySelector(".emailForm");
  emailForm.style.display = "block";
}

function autoSizeInput() {
  const inputs = document.querySelectorAll('.auto-size');
  
  inputs.forEach(input => {
    const textLength = input.placeholder.length;
    input.style.width = `${textLength + 1}ch`
  });
}autoSizeInput();

// =================
// EVENT HANDLER
// =================
lookUpBtn.addEventListener('click', async () => {
  clearError();
  
//   VALIDATION====================
  const zip = zipInput.value.trim();
  const name = nameInput.value.trim();
  
  let isValid = true;
  
  if (!name) {
    showNameError('Please enter your name');
    isValid = false;
  }
  
  if (!isValidZip(zip)) {
    showZipError('Please enter a valid 5-digit ZIP code.');
    isValid = false;
  }
  
  if(!isValid) return;
  
// EVERYTHING PASSED==================
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/andreaultreras/EmailCampaign/main/ZIPCodes-CA.json'
    );
    
    if(!response.ok){
      throw new Error('Failed to load ZIP data');
    }
    
    const zipData = await response.json();
    const location = zipData[zip];
    
    if (!location) {
      showZipError('ZIP code not found.')
      return;
    }
    console.log(location.city, location.state);
    document.querySelector(".emailForm").hidden = false;
  }
  catch (error) {
    showZipError('Unable to load ZIP data. Please try again later.');
    console.error(error);
  }
})
