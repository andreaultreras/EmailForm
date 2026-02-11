// ========================================================
// DOM Elements
// ========================================================
const zipInput = document.getElementById('zip');
const nameInput = document.getElementById('name');
const lookUpBtn = document.getElementById('lookUpBtn');
const zipErrorDiv = document.getElementById('zipError');
const nameErrorDiv = document.getElementById('nameError');
const bodyInput = document.getElementById('bodyText');
const ORIGINAL_BODY_TEMPLATE = bodyInput.value;
let emailList = [];
let nameList = [];

// ========================================================
// HELPERS
// ========================================================
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

function buildDear(names) {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  
  let dearStr = ''
    for (let i = 0; i < names.length-1; i++) {
      dearStr += names[i] + ", ";
    }
  dearStr += "& " + names[names.length-1];
  return dearStr;
}

function addToList(item) {
  emailList.push(item.email);
  nameList.push(item.name);
}

// ========================================================
// SEARCH BUTTON
// ========================================================
lookUpBtn.addEventListener('click', async () => {
  clearError();
  emailList.length = 0;
  nameList.length = 0;
  
//   Validation====================
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
  
// Everything passed, get json=====
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/andreaultreras/EmailForm/main/data/ZIPCodes-CA.json'
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

    // get a list of emails and names===
    const senatorsList = location.senators;
    const repsList = location.representative;
    senatorsList.forEach(addToList);
    repsList.forEach(addToList);
    
    const toEmail = document.getElementById('repEmails');
    toEmail.value = emailList.join(', ');

    // update the text in the template with names===
    
    // let bodyTemplate = ORIGINAL_BODY_TEMPLATE;
    currentUserName = name;
    currentRecipients = buildDear(nameList);
    
    updateTemplates(currentUserName, currentRecipients);

    // show the email form================
    document.querySelector(".emailForm").hidden = false;
  }
  catch (error) {
    showZipError('Unable to load ZIP data. Please try again later.');
    console.error(error);
  }
});

// ======================================================
document.getElementById('sendEmailBtn').addEventListener('click', () => {
  const toEmails = document.getElementById('repEmails').value;
  
  const subject = encodeURIComponent(document.getElementById('subjectInput').value.trim());
  let bodyTemplate = document.getElementById('bodyText').value.trim();
  const body = encodeURIComponent(bodyTemplate);
  
  const mailtoLink = `mailto:${toEmails}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
});

// ========================================================
// Language Toggle
// ========================================================
const toggleBtn = document.getElementById("toggleLang");
let lang = "en";

// Grab the template elements
const bodyTemplates = {
  en: document.getElementById("template-en").innerText.trim(),
  es: document.getElementById("template-es").innerText.trim()
};

const subjectTemplates = {
  en: document.getElementById("subject-en").innerText.trim(),
  es: document.getElementById("subject-es").innerText.trim()
};

// DOM elements to update
const templateBody = document.getElementById("bodyText");
const subjectInput = document.getElementById("subjectInput");

// Store current dynamic values
let currentUserName = '';
let currentRecipients = '';

// Event listener=============================================
toggleBtn.addEventListener("click", () => {
  // Toggle language
  lang = lang === "en" ? "es" : "en";
  
  // Update the toggle button label
  toggleBtn.textContent = lang === "en" ? "Español" : "English";

  // Update static page text if you have any
  document.querySelectorAll(".lang-en").forEach(el => el.style.display = lang === "en" ? "inline" : "none");
  document.querySelectorAll(".lang-es").forEach(el => el.style.display = lang === "es" ? "inline" : "none");

  // Update textareas only if search has already been done
  if (currentUserName || currentRecipients) {
    updateTemplates(currentUserName, currentRecipients);
  }
});

// ========================================================
// Update the templates for current language
// ========================================================
function updateTemplates(userName = '', recipients = '') {
  let bodyTemplate = bodyTemplates[lang];
  let subjectTemplate = subjectTemplates[lang];

  if (userName) bodyTemplate = bodyTemplate.replace('[UserName]', userName);
  if (recipients) bodyTemplate = bodyTemplate.replace('[XXXX]', recipients);

  templateBody.value = bodyTemplate;
  subjectInput.value = subjectTemplate;
}
