# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vite /plugin-react](https://github.com/vite /vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vite /plugin-react-swc](https://github.com/vite /vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vite /vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
------------------------------------------------------------------------------------------------------
to create frontend folder:npm create vite@latest my-project
>> cd my-project
select a frame work:React
select a variant:javascript
install with npm and start now?y
then change directory to my-project
install tailwind css-npm install tailwindcss @tailwindcss/vite
in vite config.  add
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
clear App. x and app.css and index.css and also in index.css write down @import "tailwindcss";
------------------------------------------------------------------------------------------------------
# URL SHORTENER FRONTEND - COMPLETE README

# Project Overview

This project is a modern MERN Stack URL Shortener Frontend built using React.  and Tailwind CSS.

The application allows users to:

* Register and Login
* Create Short URLs
* Generate QR Codes
* Track URL Analytics
* View Device Analytics
* View Country Analytics
* Manage URLs
* Restore Deleted URLs
* Receive Notifications
* Access Admin Dashboard
* Manage Users

The frontend communicates with backend APIs using Axios and uses Zustand for authentication state management.

---

# Installation

Open terminal inside frontend folder and run the following commands.

## Install React Router DOM

Used for routing between pages.

  In Terminal
npm install react-router-dom
 

---

## Install Axios

Used for backend API requests.

  In Terminal
npm install axios
 

---

## Install Recharts

Used for graphs and analytics charts.

  In Terminal
npm install recharts
 

---

## Install React Toastify

Used for toast notifications.

  In Terminal
npm install react-toastify
 

---

## Install Lucide React

Used for icons.

  In Terminal
npm install lucide-react
 

---

## Install QR Code React

Used for QR code generation.

  In Terminal
npm install qrcode.react
 

---

## Install Zustand

Used for global authentication state management.

  In Terminal
npm install zustand
 

---

# Project Structure

  In Frontend\my-project
src
│
├── Components
├── Pages
├── store
├── App. x
└── main. x
 

---

# Routing in App. x

Routes are defined using React Router DOM.

## Public Routes

login
register
 

## User Protected Routes

/dashboard
/dashboard/createurl
/dashboard/myurls
/dashboard/notifications
/dashboard/trash
/dashboard/edit/:id
/dashboard/analytics/:id
 

## Admin Protected Routes

/admindashboard
/admindashboard/manageusers
/admindashboard/user/:id
 

---

# Components Explanation

# Navbar Component

## Purpose

Responsive navigation bar for landing page.

## Features

* Logo
* Home button
* Login button
* Register button
* Mobile responsive menu

## Buttons Included

* Home
* Login
* Register

## Components Used


Link
 

---

# Sidebar Component

## Purpose

Sidebar navigation for normal users.

## Sidebar Options

* Dashboard
* Create URL
* My URLs
* Notifications
* Trash
* Logout

## Features

* Navigation between dashboard pages
* Active sidebar UI
* Logout functionality

## Components Used

  
Link
 

---

# AdminSidebar Component

## Purpose

Sidebar navigation for admin dashboard.

## Sidebar Options

* Dashboard
* Manage Users
* Logout

## Features

* Admin navigation
* Logout handling

## Components Used

  
Link
 

---

# Header Component

## Purpose

Displays page heading and subtitle.

## Features

* Welcome message
* Page titles
* Subtitles

---

# Footer Component

## Purpose

Displays footer section.

## Features

* Branding
* Copyright

---

# Loader Component

## Purpose

Displays loading animation while data is fetching.

## Features

* Loading spinner
* Loading text

---

# Popup Component

## Purpose

Displays popup messages.

## Features

* Success popup
* Error popup
* Close button

## States Used

  
showPopup
popupMessage
 

## Props Used

  
message
onClose
 

---

# StatsCard Component

## Purpose

Displays analytics statistics cards.

## Examples

* Total URLs
* Total Clicks
* Public URLs
* Private URLs
* QR URLs
* Total Users

## Props Used

  
title
value
 

---

# AnalyticsChart Component

## Purpose

Displays analytics graphs using Recharts.

## Graphs Included

* Top 5 Clicked URLs
* Monthly URL Creations

## Props Used

  
data
title
subtitle
dataKey
xKey
badge
 

---

# PieChartBox Component

## Purpose

Displays device analytics pie chart.

## Features

* Mobile clicks
* Desktop clicks
* Tablet clicks

## Props Used

  
data
title
subtitle
dataKey
nameKey
 

---

# QRCodeBox Component

## Purpose

Displays QR code for shortened URLs.

## Package Used

  
qrcode.react
 

## Props Used

  
url
 

---

# Country Table Component

## Purpose

Displays country-wise click analytics.

## Columns

* Country
* Clicks

---

# Copy Button Component

## Purpose

Copies URL to clipboard.

## Function Used

  
navigator.clipboard.writeText()
 

---

# ProtectedRoute Component

## Purpose

Protects private routes.

## Features

* Authentication checking
* Role-based protection
* Unauthorized redirect

## Components Used

  
Navigate
Outlet
 

---

# Pages Explanation

# Home Page

## Purpose

Landing page of application.

## Sections Included

* Navbar
* Hero Section
* Features Section
* Footer

## Buttons Included

* Login
* Register
* Get Started

---

# Register Page

## Purpose

Allows users to create account.

## Input Fields

* First Name
* Email
* Password

## States Used

  
fName
email
password
loading
error
 

## Functions Used

  
handleSubmit()
 

---

# Login Page

## Purpose

Allows users to login.

## Input Fields

* Email
* Password

## States Used

  
email
password
loading
error
 

## Functions Used

  
handleLogin()
 

---

# Dashboard Page

## Purpose

Main analytics dashboard for users.

## KPI Cards

* Total URLs
* Total Clicks
* Public URLs
* Private URLs
* QR URLs

## Charts Included

* Top 5 Clicked URLs
* Device Analytics Pie Chart

## Tables Included

* Country Analytics Table

## States Used

  
urls
deviceData
countryData
loading
error
refresh
 

## Hooks Used

  
useEffect
useState
useLocation
 

## Functions Used

  
fetchDashboardData()
setRefresh()
 

---

# Create URL Page

## Purpose

Allows users to create shortened URLs.

## Features

* Enter original URL
* Set privacy
* Set expiry date
* Enable QR code
* Generate short URL

## States Used

  
originalUrl
privacy
expiryDate
qrEnabled
loading
error
 

## Functions Used

  
handleCreate()
 

---

# My URLs Page

## Purpose

Displays all URLs created by user.

## Features

* Smart Redirect
* Copy URL
* Edit URL
* Analytics
* Soft Delete URL

## Buttons Included

* Smart Redirect
* Copy
* Edit
* Analytics
* Delete

## States Used

  
urls
loading
error
showPopup
popupMessage
 

## Functions Used

  
fetchUrls()
handleCopy()
handleDelete()
handleAnalytics()
handleEdit()
handleRedirectCheck()
 

## Hooks Used

  
useEffect
useState
useNavigate
 

---

# Edit URL Page

## Purpose

Allows editing existing URL details.

## Features

* Edit original URL
* Edit privacy
* Edit expiry date

## States Used

  
originalUrl
privacy
expiryDate
loading
 

## Functions Used

  
handleUpdate()
 

---

# Analytics Page

## Purpose

Displays analytics of selected URL.

## Analytics Included

* Total Clicks
* Device Analytics
* Country Analytics

## Charts Included

* Graphs
* Pie Charts

## States Used

  
analytics
loading
error
 

## Functions Used

  
fetchAnalytics()
 

---

# Notifications Page

## Purpose

Displays URL notifications.

## Notifications Included

* Expired URLs
* Max Click Alerts
* Warning Messages

## States Used

  
notifications
loading
 

---

# Trash Page

## Purpose

Displays soft deleted URLs.

## Features

* Restore URL
* Permanently Delete URL

## States Used

  
trashUrls
loading
 

## Functions Used

  
fetchTrash()
handleRestore()
 

---

# Admin Dashboard Page

## Purpose

Displays platform-wide analytics.

## KPI Cards

* Total Users
* Total URLs
* Total Clicks
* Private URLs
* Public URLs
* QR Generated

## Charts Included

* Monthly URL Creation Graph
* Device Analytics Pie Chart

## Tables Included

* Country Analytics Table

## States Used

  
dashboard
monthlyUrls
deviceStats
countryStats
loading
 

## Functions Used

  
fetchDashboard()
 

---

# Manage Users Page

## Purpose

Allows admin to manage users.

## Features

* Search users
* Block user
* Unblock user
* View user details

## Buttons Included

* View
* Block
* Unblock

## States Used

  
users
filteredUsers
search
loading
error
 

## Functions Used

  
fetchUsers()
handleStatus()
 

---

# User Details Page

## Purpose

Displays detailed information about selected user.

## Features

* User Details
* User URLs
* User Analytics
* Click Statistics

## States Used

  
user
urls
loading
error
 

---

# Store Explanation

# Auth Store (Zustand)

## Purpose

Handles global authentication state.

## States Used

  
user
isAuthenticated
isCheckingAuth
 

## Functions Used

  
login()
logout()
checkAuth()
 

## Features

* Store logged in user
* Maintain authentication
* Logout handling
* Protected route checking

---

# React Hooks Used

# useState

Used for:

* Forms
* Loading states
* Errors
* Analytics
* Search
* Popup messages

---

# useEffect

Used for:

* API fetching
* Dashboard updates
* Search filtering
* Data refresh

---

# useNavigate

Used for:

* Redirecting users
* Navigation after login/register
* Analytics page navigation
* Edit page navigation

---

# useLocation

Used for:

* Identifying current route
* Dashboard conditional rendering

---

# Axios Usage

Axios is used for backend API communication.

## Methods Used

  
axios.get()
axios.post()
axios.patch()
axios.delete()
 

---

# Features Implemented

* Authentication System
* Protected Routes
* URL Shortening
* QR Code Generation
* Smart Redirect
* URL Analytics
* Device Analytics
* Country Analytics
* Dashboard Analytics
* Admin Dashboard
* User Blocking
* Search Users
* Notifications System
* Trash Management
* Restore URLs
* Responsive UI
* Graphs and Charts

---

# Important Concepts

# Soft Delete

URLs are not permanently deleted.

Instead:

  
isDeleted = true
 

This helps:

* Restore deleted URLs
* Avoid accidental deletion
* Maintain analytics history

---

# Analytics System

Tracks:

* Clicks
* Countries
* Devices
* Top URLs

---

# Protected Routes

Routes are protected using:

* Authentication checking
* Role-based authorization

---

# Final Conclusion

This project is a complete production-level URL Shortener Frontend built using React.  and Tailwind CSS.

It demonstrates:

* React Component Architecture
* State Management
* Authentication System
* API Integration
* Dashboard Analytics
* Responsive Design
* Admin Management
* MERN Stack Concepts

The project contains both User and Admin modules with full URL analytics and management functionality.
