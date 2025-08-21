const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4200;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                }
                p {
                    color: #666;
                    line-height: 1.6;
                }
                .status {
                    color: #28a745;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Application Running Successfully!</h1>
                <p class="status">✅ Server is operational</p>
                <p>Your application is now running on port ${PORT}</p>
                <p>The setup has been completed and the server is ready to handle requests.</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
});