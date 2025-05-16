# Hotel Booker

## Project Overview

Hotel Booker is a full-stack web application designed to facilitate hotel bookings. It includes features for users to browse hotels, view room details, and make bookings. Admins can manage hotels, rooms, and bookings through a dedicated dashboard.

## Features

- User authentication and authorization
- Hotel and room management
- Booking system with date selection and guest details
- Admin dashboard for managing hotels, rooms, and bookings
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Drizzle ORM)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database setup

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hotel-booker.git
   cd hotel-booker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=development
   PORT=5000
   ```
2. Update the `vercel.json` file for deployment settings if needed.

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5000`.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and import your GitHub repository.
3. Configure the following environment variables in Vercel:
   - `DATABASE_URL`
   - `NODE_ENV`
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Deploy the project.

## License

This project is licensed under the MIT License.
