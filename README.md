# InternPulse — Responsive Internship Board

A modern, accessible, and responsive student internship portal built with pure **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. The portal enables students and early-career talent to browse curated internship opportunities, perform real-time keyword search, filter listings by technical domain and work mode, sort opportunities, save bookmarks locally, and view detailed role specifications in an accessible modal dialog.

---

## 🎯 Project Objective

To build a high-performance, accessible, and mobile-responsive internship board that complies strictly with:
- **No external frameworks or libraries:** Built with 100% native HTML5, modern CSS3, and Vanilla JavaScript (no React, Angular, Vue, Bootstrap, Tailwind, or jQuery).
- **Mobile-first responsive design:** Fluid typography, flexible CSS Grid/Flexbox layouts, and zero horizontal scrolling across smartphones, tablets, and desktop displays.
- **Accessibility standards:** Adherence to WCAG 2.1 AA (semantic landmarks, skip navigation link, keyboard focus trapping, visible focus rings, and screen-reader ARIA attributes).
- **Dynamic data rendering:** Decoupled data layer using structured JSON with defensive handling for optional fields and offline/CORS fallback.

---

## ✨ Features

- **Responsive Header & Navigation:** Sticky blur header with brand identity, live saved roles counter, and mobile hamburger navigation drawer.
- **Hero & Metrics Banner:** Engaging welcoming hero section highlighting active listings, supported domains, verified data badges, and flexible work modes.
- **Real-Time Keyword Search:** Debounced instant search across role title, company name, domain, location, description, and required skills.
- **Domain & Work Mode Filtering:** Dynamic domain dropdown populated from active data records, paired with a work mode filter (Remote, Hybrid, On-site).
- **Multi-Option Sorting:** Sort opportunities by Newest First, Title (A–Z), Company (A–Z), or Duration.
- **Active Filter Chips:** Visual chips indicating active search criteria with 1-click individual removal and a "Clear All" button.
- **LocalStorage Bookmarking:** Ability to bookmark internships with persistence across browser sessions and a "Saved Only" toggle view.
- **Accessible Role Details Modal:** Dialog displaying full role descriptions, structured responsibilities, candidate requirements, perks, and compensation metadata with keyboard Escape and focus trapping support.
- **Honest Application Handling:** Fictional demonstration records display a transparent status notice when clicked, while external links open the verified application portal.
- **Loading & Empty States:** Skeleton shimmer placeholder cards during initial load and an empty state with a 1-click filter reset action when no results match.
- **Toast Notifications & Back to Top:** Lightweight accessible toasts for user actions and an auto-appearing back-to-top floating button.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Structure** | Semantic HTML5 | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<dialog>` / ARIA modals, `<footer>` |
| **Styling** | Vanilla CSS3 | Custom CSS Properties (variables), CSS Grid, Flexbox, clamp() fluid sizing, keyframe animations |
| **Logic** | Vanilla JavaScript (ES6+) | Native DOM manipulation, asynchronous Fetch API, Array methods, LocalStorage API, Event Delegation |
| **Dataset** | Structured JSON | Fictional seed records (`data/internships.json`) with defensive parsing and offline fallbacks |

---

## 📁 Project Structure

```
basic project/
├── index.html                 # Semantic HTML5 portal markup
├── style.css                  # Modern CSS3 stylesheet and design tokens
├── script.js                  # Vanilla JavaScript state management and DOM rendering
├── data/
│   └── internships.json       # Structured fictional internship seed records
├── screenshots/               # Verified browser execution screenshots
│   ├── 01_desktop_home.png    # Desktop homepage view with active cards
│   ├── 02_search_filter.png   # Real-time search filter in action
│   ├── 03_domain_filter.png   # Domain-specific filtering
│   ├── 04_details_modal.png   # Accessible role details modal dialog
│   ├── 05_saved_bookmarks.png # LocalStorage saved roles filter
│   ├── 06_mobile_view.png     # Mobile viewport layout (390px)
│   └── 07_tablet_view.png     # Tablet viewport layout (768px)
└── README.md                  # Comprehensive documentation and test report
```

---

## 🚀 Running Locally

Because this application relies on standard web technologies, you can run it using any local static web server.

### Option 1: Using Python (Recommended)
From the project root directory, run:
```bash
python -m http.server 5173
```
Then open your browser and navigate to:
```
http://localhost:5173
```

### Option 2: Using Node.js (npx serve)
```bash
npx -y serve .
```

### Option 3: VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 4: Direct File Opening
You can also double-click `index.html` to open it directly in any browser. The built-in defensive data fallback ensures that even if browser `file://` security policies restrict `fetch()`, the application will seamlessly display all curated internship listings without errors.

---

## 🔍 How to Use Search and Filters

1. **Keyword Search:** Type any role title (e.g., `"Frontend"`), company name (e.g., `"Aura"`), technology (e.g., `"Python"`), or city into the search input. Results update immediately. Click the `&times;` icon to clear the keyword.
2. **Domain Filter:** Choose a specific domain from the dropdown (e.g., *UI/UX Design*, *Artificial Intelligence*, *Web Development*) to view roles in that discipline.
3. **Work Mode Filter:** Select *Remote*, *Hybrid*, or *On-site* to filter according to your location preferences.
4. **Sort By:** Use the sort dropdown to order listings by *Newest First*, *Role Title (A–Z)*, or *Company (A–Z)*.
5. **Combined Filtering:** Combine search terms with domain and work mode selections. The active tags bar displays each applied filter with a quick-remove button.
6. **Bookmarking:** Click the bookmark icon on any card to save it. Check the "Saved Only" box or click the "Saved" button in the header to view your shortlisted internships.
7. **Role Details:** Click "View Details" on any card to open the complete specification modal. Press `Escape` or click the close icon to dismiss.

---

## 📸 Screenshots of Completed Interface

### 1. Desktop Homepage & Metrics
![Desktop Homepage](screenshots/01_desktop_home.png)

### 2. Real-Time Keyword Search
![Keyword Search](screenshots/02_search_filter.png)

### 3. Domain-Specific Filtering
![Domain Filter](screenshots/03_domain_filter.png)

### 4. Role Specification Details Modal
![Role Details Modal](screenshots/04_details_modal.png)

### 5. Saved Roles & Bookmarks (LocalStorage)
![Saved Bookmarks](screenshots/05_saved_bookmarks.png)

### 6. Mobile Responsive Layout (390px Viewport)
![Mobile Layout](screenshots/06_mobile_view.png)

### 7. Tablet Responsive Layout (768px Viewport)
![Tablet Layout](screenshots/07_tablet_view.png)

---

## 🧪 Acceptance Criteria & Verification Matrix

All requirements from the task specification have been validated through interactive browser automation testing:

| # | Acceptance Criterion | Status | Test Result & Observations |
|---|---|---|---|
| **1** | Only HTML5, CSS3, and Vanilla JS used (no React, Bootstrap, Tailwind) | ✅ PASS | Verified zero external script or style dependencies. |
| **2** | Dynamic rendering from `data/internships.json` | ✅ PASS | All 12 fictional listings render dynamically with domain badges, locations, and stipends. |
| **3** | Real-time keyword search across title, company, skills, description | ✅ PASS | Typing "Frontend" instantly filtered to 1 relevant card; clearing restored all 12 cards. |
| **4** | Domain dropdown dynamically populated with counts | ✅ PASS | Selecting "UI/UX Design" filtered strictly to matching design opportunities. |
| **5** | Combined search and domain filters | ✅ PASS | Keyword search and domain filter operate together cleanly. |
| **6** | Reset filters action restores all listings | ✅ PASS | Clicking "Reset" restored search inputs and all 12 cards. |
| **7** | Empty state when no internships match | ✅ PASS | Displays illustrated empty state message and a 1-click filter reset button. |
| **8** | Role Details modal displays all specifications | ✅ PASS | Shows company initials monogram, full overview, responsibilities list, requirements, and perks. |
| **9** | Keyboard accessibility (Escape, focus ring, skip link) | ✅ PASS | Modal closes on Escape; skip-to-content link present; focus states visible on all buttons. |
| **10** | Fictional application notice (no fake application submissions) | ✅ PASS | Clicking Apply Now on demonstration records displays a clear disclaimer. |
| **11** | Responsive layout across mobile, tablet, and desktop | ✅ PASS | Verified on 390px (mobile), 768px (tablet), and 1240px (desktop) with zero horizontal overflow. |
| **12** | Zero console errors | ✅ PASS | Verified clean browser console during automated browser testing. |

---

## 🌐 GitHub & Deployment Guide

To deploy this project to GitHub Pages:

1. **Initialize Git & Commit:**
   ```bash
   git add .
   git commit -m "feat: complete responsive internship board with vanilla JS, CSS, and accessible modals"
   ```

2. **Create Remote Repository on GitHub:**
   - Create a new public repository on GitHub named `responsive-internship-board`.
   - Add the remote:
     ```bash
     git remote add origin https://github.com/<your-username>/responsive-internship-board.git
     git branch -M main
     git push -u origin main
     ```

3. **Enable GitHub Pages:**
   - In your GitHub repository, navigate to **Settings** &gt; **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Set Branch to `main` and folder to `/ (root)`.
   - Click **Save**.
   - Your site will be published at: `https://<your-username>.github.io/responsive-internship-board/`

---

## 📄 License & Attribution

Designed and developed as an internship portfolio demonstration project. All company names and internship records are fictional simulations created for educational and evaluation purposes.
