# URL Shortener Web Application

## Project Overview

This project is a full-stack URL Shortener Web Application developed using the MERN stack.
It allows users to convert long URLs into short and manageable links while also providing advanced analytics, dashboard management, notifications, trash recovery, and admin monitoring features.

The application focuses not only on shortening URLs but also on giving users insights into link performance through analytics such as clicks, device usage, browser statistics, operating systems, and geographic traffic analysis.

---

# Technologies Used

## Frontend

* React.js
* React Router DOM
* Axios
* Zustand (State Management)
* Tailwind CSS
* Recharts

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cookie Parser
* bcrypt

---

# Main Features

## User Authentication

* User Registration
* User Login
* Logout Functionality
* JWT-based Authentication
* Protected Routes
* Persistent Login using Zustand Store

---

# URL Management

## Create Short URLs

Users can:

* Enter original long URLs
* Generate shortened links
* Copy shortened URLs
* Track URL performance

---

## My URLs Section

Displays:

* All created URLs
* Original URL
* Short URL
* Click count
* Creation date
* Status

Users can:

* Delete URLs
* Restore deleted URLs from Trash
* View analytics

---

# Dashboard

The dashboard provides an overview of user activity.

## Dashboard Cards

Shows:

* Total URLs
* Total Clicks
* Active URLs
* Deleted URLs

---

## Charts & Analytics

### Line/Bar Analytics Charts

Visualizes:

* Daily clicks
* URL activity trends
* User engagement

### Pie Charts

Displays:

* Browser usage
* Device distribution
* Operating system analytics

---

# Analytics System

Each URL stores detailed click analytics.

## Analytics Includes

* Total clicks
* Browser statistics
* Device type
* Operating system
* Geographic location
* Referrer tracking
* Click timestamps

This helps users understand:

* Audience behavior
* Traffic sources
* Device preferences
* Link performance

---

# Notifications Module

Users receive notifications for:
* URL deletion

---

# Trash Management

Deleted URLs are not permanently removed immediately.

## Trash Features

* Restore deleted URLs
* Permanently delete URLs
* Track deleted items

This prevents accidental data loss.

---

# Admin Panel

The application also contains an Admin Dashboard.

## Admin Features

* View total users
* Monitor all URLs
* Track overall platform clicks
* User activity monitoring
* Platform analytics

---

# Frontend Structure

## Important Pages

### Authentication Pages

* SignIn.jsx
* SignUp.jsx

### User Pages

* Dashboard.jsx
* CreateUrl.jsx
* MyUrls.jsx
* Notifications.jsx
* Trash.jsx

### Admin Pages

* AdminDashboard.jsx

---

# Important Components

## Sidebar

Contains navigation links:

* Dashboard
* Create URLs
* My URLs
* Notifications
* Trash
* Logout

Navigation is implemented using `Link` from React Router DOM.

---

## StatsCard Component

Used to display:

* Counts
* Metrics
* Summary statistics

---

## AnalyticsChart Component

Used for:

* Click trend visualization
* Daily analytics graphs

---

## PieChartBox Component

Used to display:

* Browser analytics
* Device analytics
* OS analytics

---

# State Management

The project uses Zustand for authentication state handling.

## Stored States

* user
* isAuthenticated
* isCheckingAuth

## Auth Functions

* login()
* logout()
* checkAuth()

Authentication data is persisted using:

* Cookies
* localStorage

---

# Backend API Overview

## Authentication APIs

* Register User
* Login User
* Logout User
* Check Authentication

---

## URL APIs

* Create URL
* Get User URLs
* Delete URL
* Restore URL
* Get Analytics

---

# Database Collections

## Users Collection

Stores:

* Username
* Email
* Password (hashed)

---

## URLs Collection

Stores:

* Original URL
* Short URL
* Click count
* Analytics data
* User reference
* Deletion status

---

# Security Features

* Password hashing using bcrypt
* JWT token authentication
* Protected backend routes
* HTTP-only cookies
* Authentication middleware

---

# User Flow

## Step 1

User registers or logs into the application.

## Step 2

User accesses the dashboard.

## Step 3

User creates shortened URLs.

## Step 4

Users manage URLs in My URLs section.

## Step 5

Analytics are automatically collected whenever someone opens the shortened URL.

## Step 6

Users can monitor analytics from the dashboard and analytics pages.

---

# Project Goal

The goal of this project is to provide:

* Fast URL shortening
* URL management
* Detailed analytics
* User-friendly dashboard
* Secure authentication system
* Admin monitoring system

---

# Conclusion

This URL Shortener project is more than a simple link shortener.
It combines URL management, analytics tracking, dashboard visualization, authentication, notifications, and admin monitoring into one complete full-stack application.

The project demonstrates:

* MERN stack development
* REST API integration
* Authentication handling
* State management using Zustand
* Data visualization
* Dashboard design
* Full-stack application architecture
