require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static("public"));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// News API routes
app.get("/api/news", async (req, res) => {
  try {
    const { country = "us", category = "general", q = "", searchType = "top-headlines" } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    console.log("Fetching news with params:", { country, category, q, searchType });

    let response;
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
      // For everything endpoint
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

    console.log("API Response status:", response.status);
    console.log("Total results:", response.data.totalResults);

    if (!response.data.articles || response.data.articles.length === 0) {
      return res.json({
        message: "No articles found for the selected criteria",
        articles: [],
      });
    }

    res.json(response.data.articles);
  } catch (error) {
    console.error("Error fetching news:", error.response && error.response.data ? error.response.data : error.message);
    res.status(500).json({
      error: "Failed to fetch news",
      details: error.response && error.response.data ? error.response.data : error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
