// State management
let farmerProfile = {};
let matchedPrograms = [];

// DOM elements
const profileSection = document.getElementById('profile-section');
const resultsSection = document.getElementById('results-section');
const detailsSection = document.getElementById('details-section');
const profileForm = document.getElementById('profile-form');
const resultsContainer = document.getElementById('results-container');
const programDetails = document.getElementById('program-details');

// Load saved profile on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSavedProfile();
});

// Profile form submission
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect form data
    const crop = document.getElementById('crop').value;
    const purpose = document.getElementById('purpose').value;
    
    farmerProfile = {
        farmName: document.getElementById('farm-name').value,
        state: document.getElementById('state').value,
        farmSize: parseInt(document.getElementById('farm-size').value),
        experience: parseInt(document.getElementById('experience').value),
        crop: crop,
        purpose: purpose,
        isYoung: document.getElementById('young-farmer').checked,
        isBeginning: document.getElementById('beginning-farmer').checked,
        isSmall: document.getElementById('small-farmer').checked
    };
    
    // Save profile to localStorage
    saveProfile();
    
    // Find matching programs
    matchedPrograms = findMatchingPrograms(farmerProfile);
    
    // Display results
    displayResults();
    
    // Switch to results section
    showSection('results');
});

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
    showSection('profile');
});

document.getElementById('back-to-results').addEventListener('click', () => {
    showSection('results');
});

// Find matching programs
function findMatchingPrograms(profile) {
    return fundingPrograms.map(program => {
        const match = calculateMatch(program, profile);
        return {
            ...program,
            matchScore: match.score,
            matchReasons: match.reasons
        };
    })
    .filter(program => program.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

// Calculate match score
function calculateMatch(program, profile) {
    let score = 0;
    let reasons = [];
    
    // Check experience
    if (program.eligibility.maxExperience && profile.experience <= program.eligibility.maxExperience) {
        score += 25;
        reasons.push(`You qualify as a beginning farmer (${profile.experience} years experience)`);
    }
    
    // Check farmer types
    const farmerTypes = [];
    if (profile.isYoung) farmerTypes.push('young');
    if (profile.isBeginning) farmerTypes.push('beginning');
    if (profile.isSmall) farmerTypes.push('small');
    
    const matchingTypes = farmerTypes.filter(type => 
        program.eligibility.farmerTypes?.includes(type)
    );
    
    if (matchingTypes.length > 0) {
        score += matchingTypes.length * 15;
        reasons.push(`Matches your farmer status: ${matchingTypes.join(', ')}`);
    }
    
    // Check crops
    if (program.eligibility.crops?.includes(profile.crop)) {
        score += 20;
        reasons.push(`Supports your crop type: ${profile.crop.replace('_', ' ')}`);
    }
    
    // Check purpose - HIGH PRIORITY
    if (profile.purpose && program.purposes?.includes(profile.purpose)) {
        score += 30;
        reasons.push(`Directly supports your funding purpose: ${profile.purpose.replace('_', ' ')}`);
    }
    
    // Check state
    if (program.eligibility.states?.includes(profile.state)) {
        score += 20;
        reasons.push(`Available in your state`);
    }
    
    // Bonus for grants (free money)
    if (program.type === 'Grant') {
        score += 5;
        reasons.push(`Grant program - no repayment required`);
    }
    
    return { score, reasons };
}

// Display results
function displayResults() {
    resultsContainer.innerHTML = '';
    
    if (matchedPrograms.length === 0) {
        resultsContainer.innerHTML = '<p>No matching programs found. Try adjusting your profile.</p>';
        return;
    }
    
    matchedPrograms.forEach(program => {
        const card = document.createElement('div');
        card.className = 'program-card';
        card.innerHTML = `
            <span class="match-score">${program.matchScore}% Match</span>
            <h3>${program.name}</h3>
            <p><strong>${program.agency}</strong> | ${program.type} | Up to ${program.maxAmount}</p>
            <p>${program.description}</p>
            <div class="why-match">
                <h4>Why this matches you:</h4>
                <ul>
                    ${program.matchReasons.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
            </div>
        `;
        
        card.addEventListener('click', () => showProgramDetails(program));
        resultsContainer.appendChild(card);
    });
}

// Show program details
function showProgramDetails(program) {
    programDetails.innerHTML = `
        <h3>${program.name}</h3>
        <p><strong>Agency:</strong> ${program.agency}</p>
        <p><strong>Type:</strong> ${program.type}</p>
        <p><strong>Maximum Amount:</strong> ${program.maxAmount}</p>
        <p><strong>Deadline:</strong> ${program.deadline}</p>
        
        <div class="detail-section">
            <h4>Description</h4>
            <p>${program.description}</p>
        </div>
        
        <div class="detail-section">
            <h4>Benefits</h4>
            <ul>
                ${program.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
        </div>
        
        <div class="detail-section">
            <h4>Application Steps</h4>
            <div class="steps-list">
                <ol>
                    ${program.applicationSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        </div>
        
        <div class="detail-section">
            <a href="${program.url}" target="_blank" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center;">
                Visit Program Website
            </a>
        </div>
    `;
    
    showSection('details');
}

// Section navigation
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    if (section === 'profile') {
        profileSection.classList.add('active');
    } else if (section === 'results') {
        resultsSection.classList.add('active');
    } else if (section === 'details') {
        detailsSection.classList.add('active');
    }
}

// Save profile to localStorage
function saveProfile() {
    localStorage.setItem('farmerProfile', JSON.stringify(farmerProfile));
}

// Load saved profile
function loadSavedProfile() {
    const saved = localStorage.getItem('farmerProfile');
    if (saved) {
        farmerProfile = JSON.parse(saved);
        
        // Populate form
        document.getElementById('farm-name').value = farmerProfile.farmName || '';
        document.getElementById('state').value = farmerProfile.state || '';
        document.getElementById('farm-size').value = farmerProfile.farmSize || '';
        document.getElementById('experience').value = farmerProfile.experience || '';
        document.getElementById('crop').value = farmerProfile.crop || 'row_crops';
        document.getElementById('purpose').value = farmerProfile.purpose || 'equipment';
        document.getElementById('young-farmer').checked = farmerProfile.isYoung || false;
        document.getElementById('beginning-farmer').checked = farmerProfile.isBeginning || false;
        document.getElementById('small-farmer').checked = farmerProfile.isSmall || false;
    }
}
