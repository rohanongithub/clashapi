# Clash of Clans Player Lookup

A web application that allows users to look up Clash of Clans player profiles using the official Clash of Clans API.

![Project Preview](preview.png)

## Features

- Clean and modern UI with Clash of Clans theme
- Player profile lookup using player tags
- Displays detailed player information including:
  - Town Hall level
  - Experience level
  - Trophies and best trophies
  - War stars
  - Attack and defense wins
  - Clan information (if player is in a clan)

## Why This Can't Be Hosted Publicly

This project has a specific limitation due to Clash of Clans API requirements:

1. **IP Whitelisting**: The Clash of Clans API requires each API key to have specific IP addresses whitelisted
2. **No Dynamic IPs**: The API doesn't support dynamic IP addresses or wildcard IP entries
3. **Limited IP Slots**: Each API key can only whitelist a limited number of IPs (usually 10-20)

Due to these restrictions, the application can only work from whitelisted IP addresses. This makes it impractical to host publicly where users could access it from any IP address.

## Local Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A Clash of Clans Developer Account and API Key

### Getting an API Key

1. Visit [Clash of Clans Developer Portal](https://developer.clashofclans.com)
2. Create an account or log in
3. Create a new API key
4. Add your current IP address to the whitelist
   - You can find your IP by visiting [whatismyip.com](https://whatismyip.com)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/clash-of-clans-lookup.git
   cd clash-of-clans-lookup
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Open `server.js` and replace the API_TOKEN with your own:
   ```javascript
   let API_TOKEN = 'your-api-token-here';
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Development

The project structure is organized as follows:

```
├── server.js          # Express server and API proxy
├── index.html         # Main HTML file
├── styles.css         # Styling
├── app.js            # Frontend JavaScript
└── README.md         # This file
```

## Troubleshooting

1. **Invalid IP Error**: If you get an "Invalid IP" error, make sure:
   - Your current IP is whitelisted in the Clash of Clans developer portal
   - You've correctly pasted your API key in `server.js`

2. **API Key Issues**: If your API key isn't working:
   - Check if it's expired
   - Verify the IP whitelist
   - Make sure you're using the correct key format

## Contributing

Feel free to fork this project and make improvements. Pull requests are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Built by [Rohan](https://github.com/rohanongithub)
- Uses the [Clash of Clans API](https://developer.clashofclans.com) 