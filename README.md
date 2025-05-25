# 📚 Library App

A web app to manage books and loans.

## 🚀 Features

- Responsive design with Tailwind and DaisyUI
- LocalStorage persistence

### Login Page (/)
- Authentication set for librarian with username and password

### Librarian Dashboard (/librarian)
#### Tab: "Manage Books"
- Search books by title, author, genre, or ISBN dynamically
- Add and edit the title, author, ISBN, year, genre, copies, and availability of books
- Delete books
- Book status updates automatically when books are loaned and returned
- Collapsible card for the form to reduce visual clutter on smaller screens
- Automatically scrolls to the form on top when 'Edit' is clicked
- Books set to not available will not show on the 'Loan Management' tab under 'Select Book'
- Books displayed organised by genre

##### Validation:
- ISBN number needs to be 10 digits or 9 digits with 'X'
- Year needs to be a valid year
- Copies need to be greater or equal to 1
- Cannot add and edit book if the form is incomplete

#### Tab: "Loan Management"
- Add and edit the books, member name, and loan date of loans
- Automatic calculation of due date from entered loan date
- Return and delete loans
- Sync book availability and no. of copies with displayed books under 'Manage Books' tab
- 'Active', 'Returned', 'Overdue' status shown on loan list
- 'Overdue' status calculated automatically when laon date is => 14 days than today's date
- Delete button disabled if a loan has not been returned
- Collapsible card for the form to reduce visual clutter on smaller screens
- Automatically scrolls to the form on top when 'Edit' is clicked

##### Validation:
- Cannot add and edit loan if the form is incomplete

## 🛠️ Tech Stack

- React
- Tailwind CSS
- Node.js
- Vite
- DaisyUI
- ESLint

## ⚙️ Prerequisites
- Node.js (https://nodejs.org/en/download)
- npm (installed along with Node.js above)

```
# MacOS installation
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.16.0".
nvm current # Should print "v22.16.0".

# Verify npm version:
npm -v # Should print "10.9.2".

```

## 🔧 Setup

```bash
git clone https://github.com/adriana-sufian/library-app-v2.git
cd library-app-v2
npm install
npm run dev
```
### Login Credentials:
- Username: admin
- Password: admin123

## 📁 Project Structure
```
.
├── node_modules
├── public/
│   ├── book_icon1.png
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── BookForm.jsx            # Book form setup in 'Tab: Manage Books' under 'Manage Books'
│   │   ├── BookList.jsx            # Book list display in 'Tab: Manage Books'
│   │   ├── CollapsibleCard.jsx     # Global card for 'Manage Books' (Tab: Manage Books) & 'Manage Loans' (Tab: Loan Management)
│   │   ├── LoanForm.jsx            # Loan form setup in 'Tab: Loan Management' under 'Manage Loans'
│   │   ├── LoanList.jsx            # Loan list display in 'Tab: Loan Management'
│   │   └── ProtectedRoute.jsx      # Reroute to login page (/) if not logged in
│   ├── directories/
│   │   ├── LibrarianDashboard.jsx  # Compilation of BookForm, BookList, LoanForm, and LoanList components (/librarian)
│   │   └── LoginPage.jsx           # Login page setup (/)
│   ├── utils/
│   │   ├── dataService.js          # Functions for recalculating book quantity and status, seed data for books & users 
│   │   └── loanService.js          # Functions for loans and localstorage
│   ├── App.css
│   ├── App.jsx                     # Routing of the app
│   ├── index.css                   # Import of styling packages
│   └── main.jsx                    
├── .gitignore
├── eslist.config.js                # linter and formatter configuration file
├── index.html
├── package.lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```