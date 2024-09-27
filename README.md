# WTWR (What to Wear?): Backend

Project 15: WTWR (What to Wear?) Backend demonstrates the development of a secure backend using Node.js, Express, and MongoDB, focusing on user authorization and data protection. It includes JWT-based authentication for sign-in/sign-up and middleware for route protection, ensuring only authorized users can access or modify resources. The project validates user input, hashes passwords securely with bcrypt, and handles error responses for issues like invalid credentials or unauthorized access. User profile management is implemented through protected routes, allowing users to update their name and avatar. Data privacy is enforced by excluding passwords from API responses, while access control prevents users from deleting items they don't own.

## Tech Stack

- Node.js
- Express
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens) for authorization
- Validator for email and password validation
- Bcrypt for hashing passwords
- Postman for API testing
- GitHub Actions for CI/CD
- ESLint with Airbnb Style Guide
- Prettier for code formatting
- Nodemon for development server

## Deployment

- Links:
- https://wtwr.mylogisoft.com
- https://www.wtwr.mylogisoft.com
- https://api.wtwr.mylogisoft.com
