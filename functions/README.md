# Backend Functions

This directory contains all the "backend" logic for the NaijaGo application.

In a real-world scenario, these functions would be deployed as serverless functions (e.g., Google Cloud Functions, AWS Lambda) and accessed via HTTP requests from the frontend.

For this simulation, the frontend imports and calls these functions directly. This structure allows for a clean separation of concerns between the frontend UI and the backend business logic.

## Files

-   `api.ts`: Contains the core functions for interacting with external services (like the Gemini API) and simulating database operations (like fetching driver details or generating ride requests).
