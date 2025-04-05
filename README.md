# Angie's Laundry Bar

A modern laundry management system built with the MERN stack.

## Features

- 🧺 Easy laundry order placement
- 💳 Multiple payment options (Card/Crypto)
- 📱 Mobile-friendly interface
- 📊 Staff dashboard with order management
- 📈 Basic analytics and CSV export

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Express.js + Node.js + TypeScript
- State Management: React Hooks
- Styling: Tailwind CSS
- HTTP Client: Axios

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/angies-laundry.git
cd angies-laundry
```

2. Install all dependencies (frontend and backend):
```bash
npm run install-deps
```

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Building for Production

1. Build both frontend and backend:
```bash
npm run build
```

Or build them separately:
```bash
npm run build:frontend  # Build frontend only
npm run build:backend   # Build backend only
```

2. Preview the production build:
```bash
npm run preview
```

3. Start the production server:
```bash
npm start
```

## API Endpoints

- `POST /api/order` - Create a new laundry order
- `GET /api/orders` - Get all orders
- `PUT /api/order/:id` - Update order status

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the following build configuration:
   - Build Command: `npm run build:frontend`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run install-deps`

### Backend (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Set the following configuration:
   - Build Command: `npm run build:backend`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT`: Your desired port (default: 5000)

## License

MIT