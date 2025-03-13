## Running app
1. Run docker compose up -d
2. Run npm run start

### "Write some sample code to demonstrate the usage of your trading bot."
I understood this as an example of how the strategy is used, so in main.ts, the bot runs every 5 seconds via setInterval(), continuously analyzing the market and executing trades as a demonstration.

### Trading Strategy Overview
1. Fetch & Store Trades – Retrieves recent trades and saves them in the database.
2. Calculate Moving Averages – Computes short-term (5 trades) and long-term (20 trades) averages.
3. Decision Making – BUY if short-term > long-term, SELL if short-term < long-term.
4. Execute Trades – Converts USDT to crypto or crypto to USDT, logging profits/losses.
5. Logging & Tracking – Saves all actions in logs/YYYY-MM-DD/app.log.

### Bot results
The file logs/YYYY-MM-DD/app.log contains the bot's execution details, including fetched trades, calculated moving averages, executed buy/sell orders, portfolio updates, and warnings when trades cannot be executed. 

## Documentation
The bot includes Swagger UI for API interaction, accessible at http://localhost:3000/api.

1. Endpoints for fetching and retrieving trades for given symbol
2. Endpoint for retrieves the last 10 stored trades for given symbol