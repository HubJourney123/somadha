# সমাধা - Complaint Management System

ব্রাহ্মণবাড়িয়ার জনগণের জন্য ডিজিটাল অভিযোগ ব্যবস্থাপনা প্ল্যাটফর্ম

## Features

- 🔐 Google OAuth Authentication
- 📝 Complaint submission with image upload
- 📊 Real-time complaint tracking
- 👥 Multi-role admin panel (Developer, Politician, Agent)
- 📱 Mobile-responsive design
- 🌙 Dark mode support
- 🎨 Beautiful UI with Tailwind CSS
- ⚡ Fast performance with Next.js 14

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Database:** Neon PostgreSQL
- **Authentication:** NextAuth.js
- **Image Upload:** Cloudinary
- **Deployment:** Vercel
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon database account
- Google OAuth credentials
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd somadha
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=your_neon_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
DEVELOPER_PASSWORD=your_developer_password
POLITICIAN_PASSWORD=your_politician_password
```

4. Initialize database
```bash
npm run setup-db
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
somadha/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and database
│   ├── hooks/            # Custom React hooks
│   └── constants/        # Constants and configurations
├── public/               # Static files
└── ...config files
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables
4. Deploy!

## Default Admin Credentials

- **Developer:** developer@somadha.com / admin123
- **Politician:** politician@somadha.com / admin123

⚠️ **Change these in production!**

## License

© 2025 সমাধা. All rights reserved.