# Store Fleet API 

Store Fleet is a project built with Node.js, Express.js and MongoDB to manage users, products, and orders for an online store. It provides API endpoints for various functionalities related to users, products, and orders.

## Features 
### User Management

- **User Registration**: Users can sign up for a new account.
- **User Authentication**: Existing users can log in to their accounts securely.
- **Password Management**: Users can reset forgotten passwords.
- **Profile Update**: Users can update their profile information.
- **Logout**: Users can log out of their accounts securely.
- **Admin Features**: Administrators have access to additional functionalities like viewing all users, getting details of a specific user, deleting users, and updating user profiles and roles.

### Product Management

- **Product Listing**: Users can view a list of all available products.
- **Product Details**: Users can view detailed information about a specific product.
- **Product Reviews**: Users can view reviews for a product.
- **Product Addition**: Admins can add new products to the store.
- **Product Update**: Admins can update existing product details.
- **Product Deletion**: Admins can delete products from the store.
- **Product Rating**: Users can rate products.
- **Review Deletion**: Users can delete their own reviews.

### Order Management

- **Order Creation**: Users can create new orders for products they wish to purchase.

### Security

- **JWT Authentication**: Uses JSON Web Tokens (JWT) for user authentication and authorization.
- **Role-Based Access Control**: Differentiates between user roles (e.g., regular user, admin) to control access to certain functionalities.

## Installation
- Clone the repository:

``` bash
git clone <repository-url>
```

- Install dependencies:

``` npm install ```

- Set up environment variables:
  Create a .env file in the root directory and define the following variables:

SMPT_SERVICE
STORFLEET_SMPT_MAIL
STORFLEET_SMPT_MAIL_PASSWORD
STORFLEET_MAIL
JWT_Secret
JWT_Expire

- Start the server:

``` npm start ```

## Routes

### User Routes
- POST /api/users/signup
Creates a new user.

- POST /api/users/login
Logs in an existing user.

- POST /api/users/password/forget
Initiates the process to reset a forgotten password.

- PUT /api/users/password/reset/:token
Resets the user's password using the provided token.

- PUT /api/users/password/update
Updates the user's password.

- PUT /api/users/profile/update
Updates the user's profile information.

- GET /api/users/details
Gets the details of the authenticated user.

- GET /api/users/logout
Logs out the authenticated user.

- GET /api/users/admin/allusers
Gets details of all users (Admin access required).

- GET /api/users/admin/details/:id
Gets details of a specific user by ID (Admin access required).

- DELETE /api/users/admin/delete/:id
Deletes a user by ID (Admin access required).

- PUT /api/users/admin/update/:id
Updates the profile and role of a user by ID (Admin access required).

### Product Routes
- GET /api/products/products
Gets details of all products.

- GET /api/products/details/:id
Gets details of a specific product by ID.

- GET /api/products/reviews/:id
Gets all reviews of a product by ID.

- POST /api/products/add
Adds a new product (Admin access required).

- PUT /api/products/update/:id
Updates a product by ID (Admin access required).

- DELETE /api/products/delete/:id
Deletes a product by ID (Admin access required).

- PUT /api/products/rate/:id
Rates a product (User access required).

- DELETE /api/products/review/delete
Deletes a review (User access required).

### Order Routes
- POST /api/orders/new
Creates a new order (User access required).

## Middlewares
- auth: Authenticates users using JWT token.
- authByUserRole(role): Authorizes users based on their role (Admin access required).
  
## Contributing
Please feel free to suggest any changes and make a pull request 
