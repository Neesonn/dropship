# Dropship Hunter

**Version:** 1.0.0
**Date:** June 11, 2025

A modern web application designed to help dropshippers discover and analyze trending products from various e-commerce platforms. This application features a robust backend scraper, a dynamic frontend dashboard, and user-specific features like wishlists, all built with a modern tech stack.

![Application Screenshot](https://i.imgur.com/xOqJ4q8.jpeg)

---

## ✨ Core Features

This project is a feature-rich platform that includes:

-   **Multi-Source Scraping Architecture:** The backend is built to support scraping from multiple e-commerce sites (currently implemented for AliExpress).
-   **Dynamic Frontend Dashboard:** A sleek, modern user interface built with Next.js and styled with Tailwind CSS, featuring a "glassmorphism" dark theme.
-   **On-Demand & Scheduled Scraping:** Users can manually trigger a data hunt, and the architecture supports automated, scheduled scraping to keep product data fresh.
-   **Database Integration:** Scraped products are stored in a Google Firestore database, ensuring a fast and persistent user experience.
-   **User Authentication:** Secure, one-click user login and registration handled via Firebase Authentication with Google Sign-In.
-   **Personalized Wishlists:** Authenticated users can save their favorite products to a persistent, user-specific wishlist.
-   **In-Depth Product Analysis Tools:**
    -   **Profit Calculator:** An in-app modal to instantly calculate potential profit margins based on product cost, shipping, fees, and sale price.
    -   **Competitor Spy:** A feature (currently using mock data) to find other stores selling the same product.
-   **Scalable Monorepo Structure:** The frontend and backend are organized into separate projects within a single repository for streamlined development and deployment.

---

## 💻 Tech Stack

-   **Frontend:**
    -   **Framework:** Next.js (React)
    -   **Styling:** Tailwind CSS
    -   **Animations/Loaders:** `ldrs`
-   **Backend:**
    -   **Framework:** Node.js / Express
    -   **Web Scraping:** Puppeteer
-   **Database:** Google Firestore
-   **Authentication:** Firebase Authentication

---

## 📁 Project Structure

The project is organized as a monorepo with two distinct applications:

```
DROPSHIP-HUNTER/
├── backend/
│   ├── node_modules/
│   ├── debug/
│   │   └── error_screenshot.png
│   ├── firebaseConfig.js   # <-- IMPORTANT: Add your Firebase keys here
│   ├── index.js            # The Express server & Puppeteer scraper
│   └── package.json
└── frontend/
    ├── node_modules/
    ├── app/
    │   ├── components/
    │   │   └── Header.js
    │   ├── hunt/
    │   │   └── [source]/
    │   │       └── page.js     # Dynamic page for displaying products
    │   ├── wishlist/
    │   │   └── page.js     # User's wishlist page
    │   ├── AuthContext.js  # Manages user login state
    │   ├── globals.css
    │   └── page.js         # The main dashboard/landing page
    ├── firebaseConfig.js   # <-- IMPORTANT: Add your Firebase keys here
    └── ...                 # Other Next.js & config files
```

---

## 🚀 Setup and Installation

Follow these steps to get the entire application running on your local machine.

### **Prerequisites**

-   Node.js and npm installed on your system.

### **1. Firebase Setup (One-Time Setup)**

This project requires a Google Firebase project to handle the database and user authentication.

1.  **Create a Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication:**
    -   In your project, go to the **Build > Authentication** section.
    -   Click "Get started," select **Google** from the list of providers, **enable** it, and save.
3.  **Create Firestore Database:**
    -   Go to **Build > Firestore Database**.
    -   Click "Create database," choose **Production mode**, and select a server location.
4.  **Set Security Rules:**
    -   In Firestore, go to the **Rules** tab.
    -   Replace the entire contents with the following and click **Publish**:
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /products/{productId} {
              allow read: if true;
              allow write: if false;
            }
            match /users/{userId}/wishlist/{productId} {
              allow read, write, delete: if request.auth.uid == userId;
            }
          }
        }
        ```
5.  **Get Config Keys:**
    -   Go to **Project settings** (click the gear icon ⚙️) and scroll down to "Your apps".
    -   Click the web icon (`</>`) to register a new web app.
    -   Nickname it and register. Firebase will provide you with a `firebaseConfig` object. **Keep these keys handy.**

### **2. Backend Setup**

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Firebase:**
    -   Create a new file named `firebaseConfig.js` in the `backend` folder.
    -   Paste your `firebaseConfig` keys into this file, wrapping them in `module.exports`:
        ```javascript
        // backend/firebaseConfig.js
        module.exports = {
          firebaseConfig: {
            apiKey: "...",
            authDomain: "...",
            // etc.
          }
        };
        ```
4.  **Start the backend server:**
    ```bash
    npm start
    ```
    Your backend should now be running on `http://localhost:3001`.

### **3. Frontend Setup**

1.  **Navigate to the frontend folder** in a **new terminal window**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install ldrs firebase
    ```
3.  **Configure Firebase:**
    -   Create a new file named `firebaseConfig.js` in the `frontend` folder.
    -   Paste your `firebaseConfig` keys into this file, this time using `export`:
        ```javascript
        // frontend/firebaseConfig.js
        export const firebaseConfig = {
          apiKey: "...",
          authDomain: "...",
          // etc.
        };
        ```
4.  **Start the frontend server:**
    ```bash
    npm run dev
    ```
    Your frontend should now be running on `http://localhost:3000`.

---

## 🕹️ How to Use the Application

1.  **Visit the App:** Open `http://localhost:3000` in your browser. You will see the main dashboard.
2.  **Log In:** Click the "Login with Google" button in the header and sign in using the Google pop-up.
3.  **Choose a Source:** Click the "AliExpress" card on the dashboard to navigate to the hunt page.
4.  **Populate the Database:** The page will initially show "No Products Found." Click the **"Hunt for New Products"** button to trigger the backend scraper. This will take a minute to run.
5.  **View Products:** Once the scrape is complete, the page will automatically refresh to display a grid of all the products found.
6.  **Analyze Products:** Click on any product card to open the **Profit Calculator** modal.
7.  **Save to Wishlist:** Click the heart icon on any product card to save it to your personal wishlist.
8.  **View Wishlist:** Click the "My Wishlist" link in the header to see all your saved items.
