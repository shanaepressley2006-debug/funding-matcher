// Simple, working version
document.addEventListener('DOMContentLoaded', function() {
    console.log('App loaded');
    
    // Example profile button
    const exampleBtn = document.getElementById('use-example');
    if (exampleBtn) {
        exampleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Example button clicked');
            
            document.getElementById('farm-name').value = "Carter Family Farm";
            document.getElementById('location').value = "Orangeburg County, SC";
            document.getElementById('farm-size').value = 250;
            document.getElementById('owned-land').value = 175;
            document.getElementById('leased-land').value = 75;
            document.getElementById('experience').value = 6;
            
            document.getElementById('crop-corn').checked = true;
            document.getElementById('crop-soybeans').checked = true;
            document.getElementById('crop-cotton').checked = true;
            
            document.getElementById('need-equipment').checked = true;
            document.getElementById('need-operating').checked = true;
            
            document.getElementById('young-farmer').checked = true;
            document.getElementById('beginning-farmer').checked = true;
            document.getElementById('small-farmer').checked = true;
        });
    }
    
    // Form submission
    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get crops
            const crops = [];
            if (document.getElementById('crop-corn').checked) crops.push('corn');
            if (document.getElementById('crop-soybeans').checked) crops.push('soybeans');
            if (document.getElementById('crop-cotton').checked) crops.push('cotton');
            if (document.getElementById('crop-wheat').checked) crops.push('wheat');
            
            // Get needs
            const needs = [];
            if (document.getElementById('need-equipment').checked) needs.push('equipment');
            if (document.getElementById('need-operating').checked) needs.push('operating_costs');
            if (document.getElementById('need-land-purchase').checked) needs.push('land_purchase');
            if (document.getElementById('need-irrigation').checked) needs.push('irrigation');
            
            const profile = {
                farmName: document.getElementById('farm-name').value,
                location: document.getElementById('location').value,
                farmSize: parseInt(document.getElementById('farm-size').value) || 0,
                ownedLand: parseInt(document.getElementById('owned-land').value) || 0,
                leasedLand: parseInt(document.getElementById('leased-land').value) || 0,
                experience: parseInt(document.getElementById('experience').value) || 0,
                crops: crops,
                needs: needs,
                isYoung: document.getElementById('young-farmer').checked,
                isBeginning: document.getElementById('beginning-farmer').checked,
                isSmall: document.getElementById('small-farmer').checked
            };
            
            console.log('Profile:', profile);
            
            // Find matches
            const matches = findMatches(profile);
            console.log('Matches:', matches);
            
            // Show results
            showResults(matches);
        });
    }
    
    // Back buttons
    document.getElementById('back-btn').addEventListener('click', function() {
        document.getElementById('profile-section').classList.add('active');
        document.getElementById('results-section').classList.remove('active');
        document.getElementById('details-section').classList.remove('active');
    });
    
    document.getElementById('back-to-results').addEventListener('click', function() {
        document.getElementById('profile-section').classList.remove('active');
        document.getElementById('results-section').classList.add('active');
        document.getElementById('details-section').classList.remove('active');
    });
});

function findMatches(profile) {
    const state = profile.location.includes('SC') ? 'SC' : 
                  profile.location.includes('NC') ? 'NC' : 
                  profile.location.includes('GA') ? 'GA' : '';
    
    return fundingPrograms.map(program => {
        let score = 0;
        const reasons = [];
        
        // Experience
        if (program.eligibility.maxExperience && profile.experience <= program.eligibility.maxExperience) {
            score += 30;
            reasons.push(`✓ Beginning farmer (${profile.experience} years)`);
        }
        
        // Farmer types
        if (profile.isYoung && program.eligibility.farmerTypes?.includes('young')) {
            score += 20;
            reasons.push('✓ Young farmer priority');
        }
        if (profile.isBeginning && program.eligibility.farmerTypes?.includes('beginning')) {
            score += 20;
            reasons.push('✓ Beginning farmer priority');
        }
        if (profile.isSmall && program.eligibility.farmerTypes?.includes('small')) {
            score += 20;
            reasons.push('✓ Small farmer priority');
        }
        
        // Crops
        const matchingCrops = profile.crops.filter(c => program.eligibility.crops?.includes(c));
        if (matchingCrops.length > 0) {
            score += 15;
            reasons.push(`✓ Supports: ${matchingCrops.join(', ')}`);
        }
        
        // Needs
        const matchingNeeds = profile.needs.filter(n => program.purposes?.includes(n));
        if (matchingNeeds.length > 0) {
            score += matchingNeeds.length * 25;
            reasons.push(`✓ Funding for: ${matchingNeeds.join(', ')}`);
        }
        
        // State
        if (state && program.eligibility.states?.includes(state)) {
            score += 15;
            reasons.push('✓ Available in your state');
        }
        
        // Grant bonus
        if (program.type === 'Grant') {
            score += 10;
            reasons.push('✓ Grant - no repayment');
        }
        
        return {
            ...program,
            matchScore: score,
            matchReasons: reasons
        };
    })
    .filter(p => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function showResults(matches) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    if (matches.length === 0) {
        container.innerHTML = '<p>No matches found. Try adjusting your profile.</p>';
        return;
    }
    
    // Best pick
    const best = matches[0];
    const bestCard = document.createElement('div');
    bestCard.className = 'best-pick';
    bestCard.innerHTML = `
        <div class="best-pick-badge">🏆 BEST PICK FOR YOU</div>
        <div class="best-pick-title">${best.name}</div>
        <div class="best-pick-meta">${best.agency} • ${best.type} • Up to ${best.maxAmount}</div>
        <p style="margin: 12px 0;">${best.description}</p>
        <div class="best-pick-reason">
            <h4>Why this is your best option:</h4>
            <ul>${best.matchReasons.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
        <button class="btn-view-best" onclick="showDetails(${best.id})">View Full Details →</button>
    `;
    container.appendChild(bestCard);
    
    // Other matches
    if (matches.length > 1) {
        const header = document.createElement('h3');
        header.className = 'other-matches-header';
        header.textContent = 'Other Matching Programs';
        container.appendChild(header);
        
        matches.slice(1).forEach(program => {
            const card = document.createElement('div');
            card.className = 'program-card';
            card.innerHTML = `
                <span class="match-score">${program.matchScore}% Match</span>
                <h3>${program.name}</h3>
                <p><strong>${program.agency}</strong> | ${program.type} | Up to ${program.maxAmount}</p>
                <p>${program.description}</p>
                <div class="why-match">
                    <h4>Why this matches:</h4>
                    <ul>${program.matchReasons.map(r => `<li>${r}</li>`).join('')}</ul>
                </div>
            `;
            card.onclick = () => showDetails(program.id);
            container.appendChild(card);
        });
    }
    
    // Show results section
    document.getElementById('profile-section').classList.remove('active');
    document.getElementById('results-section').classList.add('active');
}

function showDetails(programId) {
    const program = fundingPrograms.find(p => p.id === programId);
    if (!program) return;
    
    const container = document.getElementById('program-details');
    container.innerHTML = `
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
            <h4>Key Benefits</h4>
            <ul>${program.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
        
        <div class="detail-section">
            <h4>Application Steps</h4>
            <div class="steps-list">
                <ol>${program.applicationSteps.map((s, i) => `<li><strong>Step ${i+1}:</strong> ${s}</li>`).join('')}</ol>
            </div>
        </div>
        
        <div class="detail-section">
            <a href="${program.url}" target="_blank" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center;">
                Visit Program Website →
            </a>
        </div>
    `;
    
    document.getElementById('profile-section').classList.remove('active');
    document.getElementById('results-section').classList.remove('active');
    document.getElementById('details-section').classList.add('active');
}
