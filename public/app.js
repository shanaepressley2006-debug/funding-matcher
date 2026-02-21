let currentUser = null;
let currentToken = null;

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
        currentUser = JSON.parse(savedUser);
        currentToken = savedToken;
        showMatches();
    }
});

// Register Form
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const acres = Number(document.getElementById('reg-acres').value);
    const experience = Number(document.getElementById('reg-experience').value);
    const state = document.getElementById('reg-state').value;
    
    // Get farmer types
    const farmerType = [];
    if (document.getElementById('reg-young').checked) farmerType.push('young');
    if (document.getElementById('reg-beginning').checked) farmerType.push('beginning');
    if (document.getElementById('reg-small').checked) farmerType.push('small');
    
    // Get purposes
    const purposes = [];
    if (document.getElementById('reg-equipment').checked) purposes.push('equipment');
    if (document.getElementById('reg-operating').checked) purposes.push('operating_costs');
    if (document.getElementById('reg-land').checked) purposes.push('land_purchase');
    if (document.getElementById('reg-irrigation').checked) purposes.push('irrigation');
    
    // Validate
    if (farmerType.length === 0) {
        showAlert('Please select at least one farmer status', 'error');
        return;
    }
    
    if (purposes.length === 0) {
        showAlert('Please select at least one funding need', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, acres, experience, state, farmerType, purposes })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Registration successful! Please login.', 'success');
            document.getElementById('register-form').reset();
        } else {
            showAlert(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showAlert('Registration failed: ' + error.message, 'error');
    }
});

// Login Form
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            currentToken = data.token;
            
            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('token', currentToken);
            
            showAlert('Login successful!', 'success');
            setTimeout(() => showMatches(), 500);
        } else {
            showAlert(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showAlert('Login failed: ' + error.message, 'error');
    }
});

// Show Matches
async function showMatches() {
    try {
        const response = await fetch('/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentUser.farmProfile)
        });
        
        const programs = await response.json();
        
        // Update user info
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-acres').textContent = currentUser.farmProfile.acres;
        document.getElementById('user-experience').textContent = currentUser.farmProfile.experience;
        document.getElementById('user-state').textContent = currentUser.farmProfile.state;
        
        // Display matches
        const container = document.getElementById('matches-container');
        container.innerHTML = '';
        
        // Show matching method indicator
        if (programs.length > 0 && programs[0].matchingMethod) {
            const methodBadge = document.createElement('div');
            methodBadge.style.cssText = 'background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px; text-align: center; color: white;';
            methodBadge.innerHTML = programs[0].matchingMethod === 'bedrock' 
                ? '🤖 <strong>AI-Powered Matching</strong> - Results generated by AWS Bedrock (Claude 3 Haiku)'
                : '📊 <strong>Rule-Based Matching</strong> - Using weighted scoring algorithm';
            container.appendChild(methodBadge);
        }
        
        if (programs.length === 0) {
            container.innerHTML += '<p style="color: white; text-align: center;">No matching programs found. Try updating your profile.</p>';
        } else {
            programs.forEach((program, index) => {
                const card = document.createElement('div');
                card.className = 'program-card' + (program.isBestPick ? ' best-match' : '');
                
                card.innerHTML = `
                    ${program.isBestPick ? '<div class="badge">🏆 BEST MATCH - ' + program.matchPercentage + '% Match</div>' : '<div class="badge">' + program.matchPercentage + '% Match</div>'}
                    <h3>${program.name}</h3>
                    <div class="program-meta">
                        <strong>${program.agency}</strong> | ${program.type} | Up to ${program.maxAmount}
                    </div>
                    ${program.interestRate !== 'N/A' ? '<p style="margin: 10px 0;"><strong>Interest Rate:</strong> ' + program.interestRate + '</p>' : ''}
                    <p style="margin: 10px 0;"><strong>Deadline:</strong> ${program.deadline}</p>
                    <p style="margin: 10px 0;"><strong>Application Time:</strong> ${program.applicationTime}</p>
                    <div class="program-reason">
                        <strong>Why you match:</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            ${program.matchReasons.map(r => '<li>' + r + '</li>').join('')}
                        </ul>
                    </div>
                    <div style="margin-top: 15px;">
                        <strong>Key Benefits:</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            ${program.benefits.map(b => '<li>' + b + '</li>').join('')}
                        </ul>
                    </div>
                    <a href="${program.url}" target="_blank" style="display: inline-block; margin-top: 15px; color: ${program.isBestPick ? 'white' : '#667eea'}; text-decoration: underline;">
                        Visit Program Website →
                    </a>
                `;
                
                container.appendChild(card);
            });
        }
        
        // Switch sections
        document.getElementById('auth-section').classList.remove('active');
        document.getElementById('matches-section').classList.add('active');
        
    } catch (error) {
        showAlert('Failed to load matches: ' + error.message, 'error');
    }
}

// Logout
function logout() {
    currentUser = null;
    currentToken = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    document.getElementById('auth-section').classList.add('active');
    document.getElementById('matches-section').classList.remove('active');
    
    document.getElementById('login-form').reset();
    
    showAlert('Logged out successfully', 'success');
}

// Show Alert
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeSection.insertBefore(alert, activeSection.firstChild);
        setTimeout(() => alert.remove(), 5000);
    }
}
