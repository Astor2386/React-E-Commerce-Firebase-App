# React E-Commerce Firebase Web App

This is a TypeScript-based e-commerce web application built with React, Vite, Firebase, and Redux.
It provides a full-featured online store with user authentication, product management, cart functionality, and order history.


## Features
- **User Authentication**: Register and login with email/password using Firebase Authentication, with logout functionality.
- **User Management**: Create, read, update, and delete user profiles stored in Firestore.
- **Product Management**: Fetch, create, update, and delete products from a Firestore `products` collection, with category-based filtering.
- **Cart Management**: Add products to cart, remove items, and checkout using Redux, storing orders in Firestore.
- **Order History**: View a list of past orders with detailed product information.
- **Modular Design**: Firestore operations abstracted to `utils.ts` for reusability.

## Installation
1. Clone the repository:
   -Command Prompt-
   git clone https://github.com/Astor2386/React-E-Commerce-Firebase-App.git
   cd React-E-Commerce-Firebase-App
Install dependencies:
-Command Prompt-
npm install

Setup
-Firebase Configuration:Create a Firebase project in the Firebase Console.
-Enable Firebase Authentication and Firestore.
-Update src/firebaseConfig.ts with your Firebase credentials (replace mock values like YOUR_API_KEY).

Usage
Start the development server:
-Command Prompt-
npm run dev

Open http://localhost:5173 in your browser.
Explore the app:
Home (/): Welcome page with auth status (via Home.tsx).
Products (/products): View and manage products (via ProductList.tsx).
Add Product (/add-product): Add new products (via AddProduct.tsx).
Cart (/cart): Manage cart and checkout (via ShoppingCart.tsx).
Register (/register): Create a new account (via Register.tsx).
Login (/login): Log in or log out (via Login.tsx).
Profile (/profile): Edit user details (via UserProfile.tsx).
Orders (/orders): View order history (via OrderHistory.tsx).

File Structure
React-E-Commerce-Firebase-App/
- src/
 - * components/
   - * AddProduct.tsx        # Form to add products with Pexels default image
  - ** Home.tsx              # Welcome page with auth status
  - ** Login.tsx             # Login and logout functionality
  - ** Navbar.tsx            # Navigation bar with dynamic links
  - ** OrderHistory.tsx      # Displays order history with details
  - ** ProductList.tsx       # Product listing with CRUD and filtering
  - ** Register.tsx          # User registration form
  - ** ShoppingCart.tsx      # Cart management and checkout
  - ** UserProfile.tsx       # User profile management
-  redux/
   -  CartSlice.ts          # Manages cart state with add, remove, clear actions
   -  store.ts              # Configures Redux store
  - * App.css                   # Styles for the App component
  - * App.tsx                   # Main app with routing and auth state
 - * firebaseConfig.ts         # Firebase SDK setup (update with your credentials)
 - * index.css                 # Global styles with dark/light theme
 - * main.tsx                  # Vite entry point with React Query and Redux
 - * types.ts                  # Type definitions for Product, CartItem, Order
- * utils.ts                  # Firestore utility functions (CRUD operations)
- * vite-env.d.ts             # Vite TypeScript environment types
- public/
- node_modules/                 # Dependencies
- package.json                  # Project metadata
- tsconfig.json                 # TypeScript config
- .gitignore                    # Git ignore rules

DependenciesReact
TypeScript
Vite
Firebase
Redux Toolkit
React Router DOM
React Bootstrap
@tanstack
/react-query
axios
(Check package.json for exact versions)

Special notes:
-Utils.ts was created to fetch to the API for organization, and modularity per instructor Daniel Erazo of Coding Temple's instructions.
-Users login, and orders can be tracked via Firestore 
- firebaseConfig.ts has been modified to require users to input their own credentials, to protect the core files of the app / store.
- Home and Navbar were added purely out of aesthetics and practical use
- Pexels was used as image host, due to their browser friendly setup
