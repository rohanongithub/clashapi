document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const apiTokenInput = document.getElementById('api-token');
    const saveTokenButton = document.getElementById('save-token-btn');
    const tokenStatusElement = document.getElementById('token-status');
    const apiTokenSection = document.getElementById('api-token-section');
    const searchSection = document.getElementById('search-section');
    const playerTagInput = document.getElementById('player-tag');
    const searchButton = document.getElementById('search-btn');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const playerDetailsElement = document.getElementById('player-details');
    
    // Since we've hardcoded the token in the server, show the search section immediately
    showSearchSection();
    
    // Event listener for the save token button
    saveTokenButton.addEventListener('click', () => {
        saveToken();
    });
    
    // Event listener for pressing Enter in the token input field
    apiTokenInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveToken();
        }
    });
    
    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        searchPlayer();
    });
    
    // Event listener for pressing Enter in the player tag input field
    playerTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPlayer();
        }
    });
    
    // Function to save the API token
    async function saveToken() {
        const token = apiTokenInput.value.trim();
        
        // Validate token
        if (!token) {
            showTokenStatus('Please enter an API token', 'error');
            return;
        }
        
        try {
            const response = await fetch('/set-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to set token');
            }
            
            // Save token to local storage
            localStorage.setItem('cocApiToken', token);
            
            // Show success message
            showTokenStatus('Token saved successfully!', 'success');
            
            // Show search section after a short delay
            setTimeout(() => {
                showSearchSection();
            }, 1000);
            
        } catch (error) {
            console.error('Error setting token:', error);
            showTokenStatus(error.message || 'Failed to set token', 'error');
        }
    }
    
    // Function to show token status message
    function showTokenStatus(message, type) {
        tokenStatusElement.textContent = message;
        tokenStatusElement.className = 'token-status';
        tokenStatusElement.classList.add(type);
        tokenStatusElement.style.display = 'block';
    }
    
    // Function to show search section and hide token section
    function showSearchSection() {
        apiTokenSection.style.display = 'none';
        searchSection.style.display = 'block';
    }
    
    // Function to search for a player
    function searchPlayer() {
        const playerTag = playerTagInput.value.trim();
        
        // Validate player tag
        if (!playerTag) {
            showError('Please enter a player tag');
            return;
        }
        
        // Ensure the player tag has the # symbol
        const formattedTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
        
        // URL encode the player tag
        const encodedTag = encodeURIComponent(formattedTag);
        
        // Show loading indicator and hide other elements
        showLoading();
        
        // Fetch player details
        fetchPlayerDetails(encodedTag);
    }
    
    // Function to fetch player details from the API
    async function fetchPlayerDetails(playerTag) {
        try {
            const apiUrl = `/api/players/${playerTag}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch player data');
            }
            
            const playerData = await response.json();
            displayPlayerData(playerData);
            
        } catch (error) {
            console.error('Error fetching player data:', error);
            showError(error.message || 'Failed to fetch player data. Please try again later.');
        }
    }
    
    // Function to display player data
    function displayPlayerData(player) {
        // Hide loading and error
        loadingElement.style.display = 'none';
        errorElement.style.display = 'none';
        
        // Get townhall image based on level
        const townHallImage = getTownHallImage(player.townHallLevel);
        
        // Get league image if available
        const leagueImage = player.league ? 
            `<img src="${player.league.iconUrls.small}" alt="${player.league.name}" class="league-badge">` : '';
        
        // Create HTML for player details
        const html = `
            <div class="player-header">
                <div class="player-info">
                    ${leagueImage}
                    <h2 class="player-name">${player.name}</h2>
                    <p class="player-tag">${player.tag}</p>
                </div>
                <div class="town-hall-container">
                    <img src="${townHallImage}" alt="Town Hall ${player.townHallLevel}" class="town-hall-image">
                </div>
            </div>
            
            <div class="player-stats">
                <div class="stat-card">
                    <div class="stat-title">Town Hall Level</div>
                    <div class="stat-value">${player.townHallLevel}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Experience Level</div>
                    <div class="stat-value">${player.expLevel}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Trophies</div>
                    <div class="stat-value">
                        <span class="trophy-icon">🏆</span> ${player.trophies}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Best Trophies</div>
                    <div class="stat-value">
                        <span class="trophy-icon">🏆</span> ${player.bestTrophies}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">War Stars</div>
                    <div class="stat-value">
                        <span class="star-icon">⭐</span> ${player.warStars}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Attack Wins</div>
                    <div class="stat-value">
                        <span class="attack-icon">⚔️</span> ${player.attackWins}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Defense Wins</div>
                    <div class="stat-value">
                        <span class="defense-icon">🛡️</span> ${player.defenseWins}
                    </div>
                </div>
            </div>
            
            <div class="player-clan">
                ${player.clan ? `
                    <h3><img src="${player.clan.badgeUrls.small}" alt="${player.clan.name}" class="clan-badge"> Clan</h3>
                    <div class="clan-info">
                        <p><strong>Name:</strong> ${player.clan.name}</p>
                        <p><strong>Tag:</strong> ${player.clan.tag}</p>
                        <p><strong>Role:</strong> <span class="player-role">${formatRole(player.role)}</span></p>
                    </div>
                ` : '<h3>Not in a clan</h3>'}
            </div>
        `;
        
        // Set the HTML and show the player details
        playerDetailsElement.innerHTML = html;
        playerDetailsElement.style.display = 'block';
        
        // Add CSS for the newly added elements
        const style = document.createElement('style');
        style.textContent = `
            .league-badge {
                width: 40px;
                height: 40px;
                margin-right: 10px;
                vertical-align: middle;
            }
            
            .town-hall-image {
                height: 80px;
                filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5));
            }
            
            .town-hall-container {
                margin-left: 20px;
            }
            
            .trophy-icon, .star-icon, .attack-icon, .defense-icon {
                margin-right: 5px;
            }
            
            .clan-badge {
                width: 30px;
                height: 30px;
                vertical-align: middle;
                margin-right: 10px;
            }
            
            .player-role {
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 0.9em;
                font-weight: bold;
            }
            
            .player-role.member {
                background-color: rgba(106, 155, 201, 0.3);
                color: #6a9bc9;
            }
            
            .player-role.elder {
                background-color: rgba(255, 204, 87, 0.3);
                color: #ffcc57;
            }
            
            .player-role.coleader {
                background-color: rgba(230, 62, 49, 0.3);
                color: #ff9999;
            }
            
            .player-role.leader {
                background-color: rgba(80, 175, 80, 0.3);
                color: #90ee90;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Function to format player role
    function formatRole(role) {
        if (!role) return 'Member';
        
        // Capitalize first letter and add a CSS class
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        return `<span class="player-role ${role.toLowerCase()}">${formattedRole}</span>`;
    }
    
    // Function to get town hall image based on level
    function getTownHallImage(level) {
        // Default to max level if the level is higher than our list (for future proofing)
        const maxLevel = 15;
        const safeLevel = Math.min(level, maxLevel);
        
        // Use direct Clash of Clans official asset URL instead of wikia
        return `https://coc.guide/static/imgs/other/town-hall-${safeLevel}.png`;
    }
    
    // Function to show loading indicator
    function showLoading() {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        playerDetailsElement.style.display = 'none';
    }
    
    // Function to show error message
    function showError(message) {
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        playerDetailsElement.style.display = 'none';
        errorElement.textContent = message;
    }
}); 