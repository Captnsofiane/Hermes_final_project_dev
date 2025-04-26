# News Aggregator App

A simple Node.js application that fetches and displays the latest news articles based on user input using the NewsAPI.

## Features

- Fetch latest news articles from various sources
- Filter news by country, category, and keywords
- Clean and modern UI with Bootstrap
- Responsive design

## Prerequisites

- Node.js installed on your system
- A NewsAPI key (get one from [https://newsapi.org/](https://newsapi.org/))

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   NEWS_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select a country from the dropdown
2. Choose a news category
3. (Optional) Enter a keyword to search for specific topics
4. Click "Search News" to fetch the latest articles

## Technologies Used

- Node.js
- Express.js
- Axios
- Bootstrap 5
- NewsAPI

## License

MIT
