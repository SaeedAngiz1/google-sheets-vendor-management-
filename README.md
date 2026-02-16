# 📊 Vendor Management Portal

**A powerful desktop application for managing vendor data — seamlessly integrated with Google Sheets.**

Built with React, TypeScript, and Electron. Available as a ready-to-install Windows desktop app.

---

## 💼 What Is This App?

The **Vendor Management Portal** is a complete vendor data management solution that connects directly to Google Sheets. It gives your team a clean, professional interface to **create, view, update, and delete** vendor records — all in real-time, all synced to your spreadsheet.

No more messy spreadsheets shared over email. No more accidental data overwrites. Just a clean app that everyone on the team can use.

---

## 🚀 Why Your Company Needs This

Every business works with vendors — suppliers, distributors, manufacturers, service providers. Managing that data is critical, but most companies still do it the hard way:

- ❌ Shared spreadsheets that break when two people edit at once
- ❌ No validation — anyone can enter wrong or incomplete data
- ❌ No way to track who added what or when
- ❌ Ugly, confusing interfaces that slow everyone down

**This app solves all of that:**

| Problem | Solution |
|---------|----------|
| Messy spreadsheets | Clean, professional form-based data entry |
| Invalid data | Built-in validation — required fields, duplicate checking, format enforcement |
| No structure | Organized CRUD operations: Create, Read, Update, Delete |
| Hard to use | Modern, intuitive UI that anyone can learn in 2 minutes |
| Needs internet setup | Installs as a desktop app — just double-click and go |
| Data scattered everywhere | Single source of truth synced to Google Sheets |

Whether you're a **startup managing 10 vendors** or an **enterprise tracking hundreds**, this tool brings order to your vendor data.

---

## ✨ Features

- **Onboard New Vendors** — Professional form with validation, required fields, and duplicate detection
- **View All Vendors** — Searchable, sortable data table with instant filtering
- **Update Vendors** — Select any vendor and edit their details with pre-filled forms
- **Delete Vendors** — Safe deletion with preview and confirmation dialog
- **Google Sheets Sync** — All data reads and writes directly to your Google Spreadsheet
- **Offline Mode** — Works with local storage when no internet is available
- **Desktop App** — Runs as a standalone Windows application (no browser needed)
- **Modern UI** — Clean, responsive design that looks professional
- **Data Validation** — Prevents incomplete or duplicate entries

---

## 🖥️ Screenshots

The app features four main views:

1. **Onboard** — Add new vendors with text fields, dropdowns, multi-select, sliders, and date pickers
2. **View** — See all vendors in a searchable, sortable table
3. **Update** — Select a vendor and modify their information
4. **Delete** — Remove vendors with a safety confirmation step

---

## 💰 Ready-to-Install Version

A **ready-to-install desktop version** (.exe) is available for purchase:

### **Price: 300 €**

> 💬 **The price is negotiable** — reach out and let's talk about what works for you.

#### What you get:

- ✅ Windows installer (.exe) — just double-click and install
- ✅ Desktop shortcut and Start Menu entry
- ✅ No technical setup required — works out of the box
- ✅ Pre-configured for your Google Sheets
- ✅ Free setup support to connect your spreadsheet

#### Who is this for?

- Companies that want a **professional vendor management tool** without building one from scratch
- Teams that need a **simple, reliable way** to manage supplier data
- Businesses that already use **Google Sheets** and want a better interface on top of it

📧 **Interested? Contact me to get your copy or discuss pricing.**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| Desktop | Electron |
| Build | Vite 7 |
| Installer | electron-builder (NSIS) |
| Data Layer | Google Sheets API / localStorage |
| Styling | Custom CSS (no external dependencies) |

---

## 🔧 Developer Setup

If you're a developer and want to run the source code:

```bash
# Clone the repository
git clone https://github.com/SaeedAngiz1/google-sheets-vendor-management.git
cd google-sheets-vendor-management

# Install dependencies
npm install

# Run as web app (browser)
npm run dev
```

### Environment Variables (Optional)

Copy `.env.example` to `.env` and add your Google Sheets credentials:

```
VITE_GOOGLE_SHEETS_API_KEY=your-api-key
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
VITE_GOOGLE_SHEETS_WORKSHEET=Vendors
```

Without these, the app uses local storage with sample data — perfect for testing.

---

## 📂 Project Structure

```
├── electron/              # Desktop app (Electron main process)
│   ├── main.cjs
│   └── preload.cjs
├── src/
│   ├── components/        # React components
│   │   ├── ui/            # Reusable UI library (9 components)
│   │   ├── VendorForm/    # Create vendor
│   │   ├── VendorTable/   # View vendors
│   │   ├── VendorUpdate/  # Edit vendor
│   │   ├── VendorDelete/  # Delete vendor
│   │   ├── ActionSelector/
│   │   └── ErrorBoundary/
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Google Sheets API service
│   ├── types/             # TypeScript interfaces
│   ├── constants/         # App configuration
│   └── utils/             # Validation utilities
├── release/               # Built .exe installer (after build)
└── package.json
```

---

## 📄 License

MIT

