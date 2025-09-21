Assessment Management System

Overview
The Assessment Management System is a web-based application designed to manage and analyze health and fitness assessments. It provides a user-friendly dashboard to view session data, generate detailed PDF reports, and track vital statistics such as heart rate, blood pressure, VO2 Max, and more. Built with React for the frontend and Node.js/Express for the backend, this system integrates Puppeteer for report generation and supports authentication via JWT.
Features

User Dashboard: Displays session details including accuracy, assessment type, and report download options.
Report Generation: Creates customizable PDF reports for health and fitness or cardiac assessments.
Data Analysis: Classifies vital statistics (e.g., BMI, heart rate) with color-coded ranges (e.g., Normal, High, Low).
Authentication: Secure access using JWT tokens.
Real-Time Data: Fetches and processes dynamic session data from a local API.

Technologies Used

Frontend: React, Tailwind CSS
Backend: Node.js, Express
Report Generation: Puppeteer
Authentication: JSON Web Tokens (JWT)
Data Handling: JavaScript, Fetch API
Dependencies: Puppeteer, jwt, dotenv

Installation
Prerequisites

Node.js (v14.x or later)
npm (v6.x or later)
Git

Steps

Clone the Repository
git clone https://github.com/your-username/assessment-management-system.git
cd assessment-management-system

Install Dependencies

For the frontend (client):
cd client
npm install

For the backend (server):
cd ../server
npm install



Set Up Environment Variables

Create a .env file in the server directory with the following:
JWT_SECRET=your_secure_secret_key
PORT=5000
MONGO_URI=your_mongo_key

Adjust PORT if needed.


Run the Application

Start the backend:
cd server
npm start

Start the frontend:
cd ../client
npm start

Open http://localhost:3000 in your browser.


