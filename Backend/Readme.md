# URL Shortener Backend

## 1. Backend Setup

Create backend folder with:

```txt
node_modules
package.json
package-lock.json
```

Initialize project:

```bash
npm init -y
```

Install Express:

```bash
npm i express
```

In `package.json`:

```json
"type":"module"
```

Change:

```json
"main":"server.js"
```

---

# 2. Project Structure

```txt
Backend
│
├── API
│   ├── commonApi.js
│   ├── urlApi.js
│   └── adminApi.js
│
├── middlewares
│   ├── verifyToken.js
│   └── optionalVerifyToken.js
│
├── models
│   ├── userSchema.js
│   ├── url.js
│   └── analytics.js
│
├── .env
├── package.json
└── server.js
```

---

# 3. Database Schemas

## User Schema

Stores:

* first name
* email
* password
* role
* URL reference array
* account status
* timestamps

---

## URL Schema

Stores:

* short code
* original URL
* custom alias
* user ID
* clicks
* max clicks
* expiry
* privacy
* QR enabled
* soft delete status
* timestamps

---

## Analytics Schema

Stores:

* URL ID
* device
* browser
* operating system
* IP address
* country
* city
* timestamps

---

# 4. Server Setup

Create `server.js`.

Install required packages:

```bash
npm i cors dotenv mongoose cookie-parser
```

Responsibilities:

* connect database
* configure middleware
* configure routes
* start server

---

# 5. Environment Variables

Create `.env` file.

Store:

* PORT
* DB_URL
* SECRET_KEY
* BASE_URL

Access using:

```js
process.env.PORT
process.env.DB_URL
```

---

# 6. Common API

Create `commonApi.js` inside API folder.

Common routes:

* register
* login
* logout
* check-auth

---

# 7. Authentication

Install:

```bash
npm i bcryptjs jsonwebtoken
```

## bcryptjs

Used to:

* hash password
* compare password

## jsonwebtoken

Used to:

* generate JWT token
* authenticate users

---

# 8. Login Route

When user logs in:

* email and password are verified
* blocked user validation is checked
* JWT token is generated using `sign()`
* token is stored in cookies

---

# 9. SECRET_KEY

Add in `.env`.

Used for:

* JWT token generation
* token verification

---

# 10. Check-Auth Route

Used when:

* page refresh happens
* frontend reloads

Purpose:

* verify whether user is already logged in

Even though protected routes use `verifyToken` middleware, frontend still needs `check-auth` to maintain authentication state after refresh.

---

# 11. URL API

Create `urlApi.js` inside API folder.

Responsible for all URL-related functionality.

---

# 12. URL Features

## POST - Create Short URL

Features:

* generate short URL
* custom aliases
* unique shortcode generation
* expiry handling
* QR generation
* private/public URL support
* URL validation

Install QR package:

```bash
npm install qrcode
```

---

## GET - Use Short URL

Responsibilities:

* validate shortcode
* check expiry
* check click limits
* check privacy
* store analytics
* redirect to original URL

This is a partially protected route.

### Public URL

Accessible without login.

### Private URL

Requires authentication.

For this, `optionalVerifyToken` middleware is used.

---

## GET - All URLs

Returns:

* all URLs created by logged-in user

---

## GET - Particular URL

Returns:

* particular URL details
* analytics of that URL

Uses:

* URL ID

---

## PUT - Update URL

Features:

* update original URL
* update custom alias
* update expiry
* update privacy
* update max clicks
* update QR settings

---

# 13. URL Management

## PATCH - Soft Delete URL

Soft deletes URL using URL ID.

---

## PATCH - Restore URL

Restores previously soft deleted URL.

---

## GET - Trash

Returns:

* all soft deleted URLs

---

## DELETE - Permanent Delete

Permanently deletes URL from database.

Also removes URL reference from user document.

---

# 14. Analytics

Analytics are stored whenever short URL is accessed.

Tracked data:

* device
* browser
* operating system
* IP address
* country
* city
* timestamps

---

# 15. Packages Used

## Device, Browser, OS Detection

```bash
npm install ua-parser-js
```

## IP Geolocation

```bash
npm install geoip-lite
```

---

# 16. Middlewares

## verifyToken

Used for:

* protected routes
* role-based authorization
* user authentication

---

## optionalVerifyToken

Used for:

* partially protected routes

Example:

* public/private URL access

---

# 17. Admin API

Create `adminApi.js` inside API folder.

Admin features:

* get all users
* block/unblock users
* view particular user's URLs
* permanently delete any URL
* dashboard statistics

---

# 18. Dashboard Management

## User Dashboard

Features:

* total URLs
* total clicks
* URL management
* analytics data
* graph-ready analytics response

---

## Admin Dashboard

Features:

* total users
* active users
* blocked users
* total URLs
* total clicks

---

# 19. Security Features

Implemented:

* password hashing
* JWT authentication
* protected routes
* role-based authorization
* ownership validation
* URL validation
* private URL access control
* cookie-based authentication

---

# 20. Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* QRCode
* ua-parser-js
* geoip-lite
* cookie-parser
* dotenv
* cors
