// State management
let farmerProfile = {};
let matchedPrograms = [];
let currentProgram = null;
let bookmarkedPrograms = [];
let trackedPrograms = {};

// DOM elements
const profileSection = document.getElementById('profile-section');
const resultsSection = document.getElementById('results-section');
const detailsSection = document.getElementById('details-section');
const profileForm = document.getElementById('profile-form');
const resultsContainer = document.getElementById('results-container');
const programDetails = document.getElementById('program-details');

// Example profile data (Michael Carter)
const exampleProfile = {
    farmName: "Carter Family Farm",
    location: "Orangeburg County, SC",
    farmSize: 250,
    ownedLand: 175,
    leasedLand: 75,
    experience: 6,
    crops: ['corn', 'soybeans', 'cotton', 'wheat'],
    needs: ['equipment', 'operating_costs'],
    employment: 'full-time',
    isYoung: true,
    isBeginning: true,
    isSmall: true
};

// Load saved data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSavedProfile();
    loadBookmarks();
    loadTrackedPrograms();
    
    // Add example profile button handler
    document.getElementById('use-example').addEventListener('click', fillExampleProfile);
});

// Fill example profile
function fillExampleProfile() {
    document.getElementById('farm-name').value = exampleProfile.farmName;
    document.getElementById('location').value = exampleProfile.location;
    document.getElementById('farm-size').value = exampleProfile.farmSize;
    document.getElementById('owned-land').value = exampleProfile.ownedLand;
    document.getElementById('leased-land').value = exampleProfile.leasedLand;
    document.getElementById('experience').value = exampleProfile.experience;
    
    // Set crop checkboxes
    exampleProfile.crops.forEach(crop => {
        const checkbox = document.getElementById(`crop-${crop}`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Set needs checkboxes
    exampleProfile.needs.forEach(need => {
        const checkbox = document.getElementById(`need-${need.replace('_', '-')}`);
        if (checkbox) checkbox.checked = true;
    });
    
    document.getElementById('employment').value = exampleProfile.employment;
    document.getElementById('young-farmer').checked = exampleProfile.isYoung;
    document.getElementById('beginning-farmer').checked = exampleProfile.isBeginning;
    document.getElementById('small-farmer').checked = exampleProfile.isSmall;
}

// Profile form submission
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect crops
    const crops = [];
    ['corn', 'soybeans', 'cotton', 'wheat'].forEach(crop => {
        if (document.getElementById(`crop-${crop}`).checked) {
            crops.push(crop);
        }
    });
    
    // Collect needs
    const needs = [];
    ['equipment', 'operating-costs', 'land-purchase', 'irrigation'].forEach(need => {
        if (document.getElementById(`need-${need}`).checked) {
            needs.push(need.replace('-', '_'));
        }
    });
    
    // Validate at least one crop and one need selected
    if (crops.length === 0) {
        alert('Please select at least one crop type');
        return;
    }
    
    if (needs.length === 0) {
        alert('Please select at least one funding need');
        return;
    }
    
    farmerProfile = {
        farmName: document.getElementById('farm-name').value,
        location: document.getElementById('location').value,
        farmSize: parseInt(document.getElementById('farm-size').value),
        ownedLand: parseInt(document.getElementById('owned-land').value) || 0,
        leasedLand: parseInt(document.getElementById('leased-land').value) || 0,
        experience: parseInt(document.getElementById('experience').value),
        crops: crops,
        needs: needs,
        employment: document.getElementById('employment').value,
        isYoung: document.getElementById('young-farmer').checked,
        isBeginning: document.getElementById('beginning-farmer').checked,
        isSmall: document.getElementById('small-farmer').checked
    };
    
    saveProfile();
    matchedPrograms = findMatchingPrograms(farmerProfile);
    displayResults();
    showSection('results');
});

// Navigation
document.getElementById('back-btn').addEventListener('click', () => showSection('profile'));
document.getElementById('back-to-results').addEventListener('click', () => showSection('results'));

// Find matching programs
function findMatchingPrograms(profile) {
    return fundingPrograms.map(program => {
        const match = calculateMatch(program, profile);
        return { ...program, matchScore: match.score, matchReasons: match.reasons };
    })
    .filter(program => program.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

// Calculate match score
function calculateMatch(program, profile) {
    let score = 0;
    let reasons = [];
    
    // Experience check (high priority for YBS)
    if (program.eligibility.maxExperience && profile.experience <= program.eligibility.maxExperience) {
        score += 30;
        reasons.push(`✓ You qualify as a beginning farmer (${profile.experience} years experience)`);
    }
    
    // Farmer type matching (critical for YBS)
    const farmerTypes = [];
    if (profile.isYoung) farmerTypes.push('young');
    if (profile.isBeginning) farmerTypes.push('beginning');
    if (profile.isSmall) farmerTypes.push('small');
    
    const matchingTypes = farmerTypes.filter(type => program.eligibility.farmerTypes?.includes(type));
    if (matchingTypes.length > 0) {
        score += matchingTypes.length * 20;
        reasons.push(`✓ Matches your YBS status: ${matchingTypes.join(', ')}`);
    }
    
    // Crop matching
    if (program.eligibility.crops) {
        const matchingCrops = profile.crops.filter(crop => program.eligibility.crops.includes(crop));
        if (matchingCrops.length > 0) {
            score += 15;
            reasons.push(`✓ Supports your crops: ${matchingCrops.join(', ')}`);
        }
    }
    
    // Purpose/needs matching (high priority)
    if (program.purposes) {
        const matchingNeeds = profile.needs.filter(need => program.purposes.includes(need));
        if (matchingNeeds.length > 0) {
            score += matchingNeeds.length * 25;
            reasons.push(`✓ Addresses your needs: ${matchingNeeds.map(n => n.replace('_', ' ')).join(', ')}`);
        }
    }
    
    // Location check
    const state = profile.location.includes('SC') ? 'SC' : 
                  profile.location.includes('NC') ? 'NC' : 
                  profile.location.includes('GA') ? 'GA' : '';
    
    if (state && program.eligibility.states?.includes(state)) {
        score += 15;
        reasons.push(`✓ Available in your state`);
    }
    
    // Farm size consideration
    if (profile.farmSize <= 300 && program.eligibility.farmerTypes?.includes('small')) {
        score += 10;
        reasons.push(`✓ Designed for small-scale operations like yours`);
    }
    
    // Grant bonus (free money!)
    if (program.type === 'Grant') {
        score += 10;
        reasons.push(`✓ Grant program - no repayment required`);
    }
    
    // Off-farm employment consideration
    if (profile.employment === 'full-time' && program.eligibility.farmerTypes?.includes('beginning')) {
        score += 5;
        reasons.push(`✓ Accommodates farmers with off-farm employment`);
    }
    
    return { score, reasons };
}

// Get best pick using smart algorithm
function getBestPick(programs) {
    const scored = programs.map(program => {
        let score = program.matchScore;
        
        // Strong preference for grants
        if (program.type === 'Grant') score += 15;
        
        // Deadline urgency
        const urgency = getDeadlineUrgency(program.deadline);
        if (urgency === 'urgent') score += 20;
        else if (urgency === 'soon') score += 10;
        
        // YBS priority programs
        if (farmerProfile.isBeginning && program.eligibility.farmerTypes?.includes('beginning')) {
            score += 10;
        }
        
        // Multiple needs match
        if (program.purposes) {
            const matchCount = farmerProfile.needs.filter(need => program.purposes.includes(need)).length;
            score += matchCount * 8;
        }
        
        // Simplicity bonus (fewer application steps)
        if (program.applicationSteps && program.applicationSteps.length <= 5) {
            score += 5;
        }
        
        return { ...program, finalScore: score };
    });
    
    return scored.sort((a, b) => b.finalScore - a.finalScore)[0];
}

// Create best pick card
function createBestPickCard(program) {
    const card = document.createElement('div');
    card.className = 'best-pick';
    
    const whyBest = [];
    if (program.type === 'Grant') whyBest.push('💰 Free money - no repayment required');
    if (program.matchScore >= 90) whyBest.push('🎯 Perfect match for your profile');
    else if (program.matchScore >= 75) whyBest.push('✨ Excellent match for your profile');
    
    const urgency = getDeadlineUrgency(program.deadline);
    if (urgency === 'urgent') whyBest.push('⏰ Urgent deadline - apply soon!');
    else if (urgency === 'soon') whyBest.push('📅 Deadline approaching');
    
    if (farmerProfile.isBeginning && program.eligibility.farmerTypes?.includes('beginning')) {
        whyBest.push('🌱 Priority for beginning farmers like you');
    }
    
    if (program.applicationSteps && program.applicationSteps.length <= 5) {
        whyBest.push('⚡ Simple application process');
    }
    
    card.innerHTML = `
        <div class="best-pick-badge">🏆 BEST PICK FOR YOU</div>
        <div class="best-pick-title">${program.name}</div>
        <div class="best-pick-meta">
            ${program.agency} • ${program.type} • Up to ${program.maxAmount}
        </div>
        <p style="margin: 12px 0; line-height: 1.6;">${program.description}</p>
        <div class="best-pick-reason">
            <h4>Why this is your best option:</h4>
            <ul>
                ${whyBest.map(reason => `<li>${reason}</li>`).join('')}
                ${program.matchReasons.slice(0, 3).map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        </div>
        <div class="best-pick-actions">
            <button class="btn-view-best">View Full Details & Application Steps →</button>
        </div>
    `;
    
    card.querySelector('.btn-view-best').addEventListener('click', () => showProgramDetails(program));
    return card;
}

// Create regular program card
function createProgramCard(program) {
    const card = document.createElement('div');
    card.className = 'program-card';
    
    const bookmarkBadge = isBookmarked(program.id) ? '<span class="bookmark-indicator">⭐ Bookmarked</span>' : '';
    const trackingBadge = isTracked(program.id) ? '<span class="tracking-indicator">✓ Tracking</span>' : '';
    
    card.innerHTML = `
        <span class="match-score">${program.matchScore}% Match</span>
        ${getDeadlineBadge(program.deadline)}
        ${bookmarkBadge}
        ${trackingBadge}
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
    return card;
}

// Display results with Best Pick
function displayResults() {
    resultsContainer.innerHTML = '';
    
    if (matchedPrograms.length === 0) {
        resultsContainer.innerHTML = '<p>No matching programs found. Try adjusting your profile.</p>';
        return;
    }
    
    // Show Best Pick
    const bestPick = getBestPick(matchedPrograms);
    const bestPickCard = createBestPickCard(bestPick);
    resultsContainer.appendChild(bestPickCard);
    
    // Add header for other matches
    const header = document.createElement('h3');
    header.className = 'other-matches-header';
    header.textContent = 'Other Matching Programs';
    resultsContainer.appendChild(header);
    
    // Show remaining programs
    matchedPrograms.slice(1).forEach(program => {
        const card = createProgramCard(program);
        resultsContainer.appendChild(card);
    });
}

// Show program details
function showProgramDetails(program) {
    currentProgram = program;
    
    const estimatedTime = program.applicationSteps ? 
        `Estimated completion time: ${Math.ceil(program.applicationSteps.length * 10)} minutes` : '';
    
    programDetails.innerHTML = `
        <h3>${program.name}</h3>
        <p><strong>Agency:</strong> ${program.agency}</p>
        <p><strong>Type:</strong> ${program.type}</p>
        <p><strong>Maximum Amount:</strong> ${program.maxAmount}</p>
        <p><strong>Deadline:</strong> ${program.deadline} ${getDeadlineBadge(program.deadline)}</p>
        
        <div class="detail-section">
            <h4>Description</h4>
            <p>${program.description}</p>
        </div>
        
        <div class="detail-section">
            <h4>Key Benefits</h4>
            <ul>
                ${program.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
        </div>
        
        <div class="detail-section">
            <h4>Step-by-Step Application Process</h4>
            ${estimatedTime ? `<p class="time-estimate">${estimatedTime}</p>` : ''}
            <div class="steps-list">
                <ol>
                    ${program.applicationSteps.map((step, index) => `
                        <li>
                            <strong>Step ${index + 1}:</strong> ${step}
                        </li>
                    `).join('')}
                </ol>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Why This Matches You</h4>
            <ul>
                ${program.matchReasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        </div>
        
        <div class="detail-section" style="display: flex; gap: 12px;">
            <a href="${program.url}" target="_blank" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center; flex: 1;">
                Visit Program Website →
            </a>
        </div>
    `;
    
    showSection('details');
}

// Section navigation
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
}

// Bookmark functions
function loadBookmarks() {
    const saved = localStorage.getItem('bookmarkedPrograms');
    if (saved) bookmarkedPrograms = JSON.parse(saved);
}

function saveBookmarks() {
    localStorage.setItem('bookmarkedPrograms', JSON.stringify(bookmarkedPrograms));
}

function isBookmarked(programId) {
    return bookmarkedPrograms.some(p => p.id === programId);
}

// Tracking functions
function loadTrackedPrograms() {
    const saved = localStorage.getItem('trackedPrograms');
    if (saved) trackedPrograms = JSON.parse(saved);
}

function saveTrackedPrograms() {
    localStorage.setItem('trackedPrograms', JSON.stringify(trackedPrograms));
}

function isTracked(programId) {
    return !!trackedPrograms[programId];
}

// Deadline functions
function getDeadlineUrgency(deadline) {
    if (deadline.toLowerCase().includes('rolling') || deadline.toLowerCase().includes('year-round')) {
        return 'normal';
    }
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntil = Math.floor((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 30) return 'urgent';
    if (daysUntil < 60) return 'soon';
    return 'normal';
}

function getDeadlineBadge(deadline) {
    const urgency = getDeadlineUrgency(deadline);
    const labels = { urgent: '🔴 Urgent', soon: '🟡 Soon', normal: '🟢 Open' };
    return `<span class="deadline-badge deadline-${urgency}">${labels[urgency]}</span>`;
}

// Profile functions
function saveProfile() {
    localStorage.setItem('farmerProfile', JSON.stringify(farmerProfile));
}

function loadSavedProfile() {
    const saved = localStorage.getItem('farmerProfile');
    if (saved) {
        farmerProfile = JSON.parse(saved);
        document.getElementById('farm-name').value = farmerProfile.farmName || '';
        document.getElementById('location').value = farmerProfile.location || '';
        document.getElementById('farm-size').value = farmerProfile.farmSize || '';
        document.getElementById('owned-land').value = farmerProfile.ownedLand || 0;
        document.getElementById('leased-land').value = farmerProfile.leasedLand || 0;
        document.getElementById('experience').value = farmerProfile.experience || '';
        
        // Restore crop checkboxes
        if (farmerProfile.crops) {
            farmerProfile.crops.forEach(crop => {
                const checkbox = document.getElementById(`crop-${crop}`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Restore needs checkboxes
        if (farmerProfile.needs) {
            farmerProfile.needs.forEach(need => {
                const checkbox = document.getElementById(`need-${need.replace('_', '-')}`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        document.getElementById('employment').value = farmerProfile.employment || 'full-time';
        document.getElementById('young-farmer').checked = farmerProfile.isYoung || false;
        document.getElementById('beginning-farmer').checked = farmerProfile.isBeginning || false;
        document.getElementById('small-farmer').checked = farmerProfile.isSmall || false;
    }
}
