require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// Serve static files
app.use(express.static("docs"));
app.use(express.json());
 
// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "index.html"));
});
 
// News API routes
app.get("/api/news", async (req, res) => {
  try {
    const { country = "us", category = "general", q = "", searchType = "top-headlines" } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
 
    if (!apiKey) {
      return res.status(500).json({
        error: "News API key is not configured",
        message: "Please check your .env file and ensure NEWS_API_KEY is set",
      });
    }
 
    console.log("Fetching news with params:", { country, category, q, searchType });
 
    let response;
    try {
      if (searchType === "top-headlines") {
        response = await axios.get("https://newsapi.org/v2/top-headlines", {
          params: {
            country,
            category,
            q,
            apiKey,
            pageSize: 5,
          },
        });
      } else {
        response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: q || category,
            language: "en",
            sortBy: "publishedAt",
            apiKey,
            pageSize: 5,
          },
        });
      }
    } catch (apiError) {
      console.error(
        "NewsAPI Error:",
        apiError.response && apiError.response.data ? apiError.response.data : apiError.message
      );
      return res.status(apiError.response && apiError.response.status ? apiError.response.status : 500).json({
        error: "Failed to fetch news from NewsAPI",
        details: apiError.response && apiError.response.data ? apiError.response.data : apiError.message,
      });
    }
 
    // Validate response data
    if (!response.data || typeof response.data !== "object") {
      console.error("Invalid response format from NewsAPI:", response.data);
      return res.status(500).json({
        error: "Invalid response format from NewsAPI",
        message: "The API returned an unexpected response format",
      });
    }
 
    console.log("API Response status:", response.status);
    console.log("Total results:", response.data.totalResults);
 
    if (!response.data.articles || !Array.isArray(response.data.articles) || response.data.articles.length === 0) {
      return res.json({
        message: "No articles found for the selected criteria",
        articles: [],
      });
    }
 
    res.json(response.data.articles);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 
