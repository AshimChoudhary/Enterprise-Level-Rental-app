# 🏠 Enterprise Real Estate Rental Platform

A full-stack real estate rental application built with Next.js, Express, PostgreSQL, and AWS services. This platform enables property managers to list rental properties and tenants to search, apply, and manage their rentals.

## Deployment
Previously deployed on AWS EC2.
Instance stopped to avoid ongoing cloud costs.

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192?style=flat&logo=postgresql)
![AWS](https://img.shields.io/badge/AWS-Cognito%20%7C%20S3-orange?style=flat&logo=amazon-aws)

## 🎬 Screenshots

### Landing Page

![Landing Page](./screenshots/01-landing-page.png)
_Modern landing page with property search and features showcase_

### Property Search with Interactive Map

![Search with Map](./screenshots/02-search-with-map.png)
_Advanced search interface with real-time Mapbox integration showing properties on an interactive map_

### Search with Filters

![Search Filters](./screenshots/03-search-filters.png)
_Comprehensive filtering options: location, price range, beds, baths, and property type_

### Property Details

![Property Details](./screenshots/04-property-details.png)
_Detailed property view with image gallery, amenities, location map, and application form_

### Manager Dashboard

![Manager Dashboard](./screenshots/05-manager-dashboard.png)
_Property manager dashboard for managing listings and viewing applications_

### Add New Property

![Add Property Form](./screenshots/06-add-property.png)
_Intuitive property creation form with image upload and automatic geocoding_

### Tenant Dashboard

![Tenant Dashboard](./screenshots/07-tenant-dashboard.png)
_Tenant dashboard showing favorites, current residences, and applications_

### Applications Management

![Applications](./screenshots/08-applications.png)
_Application management interface with status tracking and review capabilities_

## ✨ Features

### For Property Managers

- 🏢 **Property Management** - Create, edit, and manage rental listings
- 📸 **Photo Uploads** - Upload property images to AWS S3
- 📋 **Application Review** - Review and approve/deny rental applications
- 💰 **Lease Management** - Track leases and payment schedules
- 📊 **Dashboard** - View all managed properties and applications

### For Tenants

- 🔍 **Advanced Search** - Search properties by location, price, beds, baths, and type
- 🗺️ **Interactive Maps** - View properties on Mapbox with real-time locations
- ❤️ **Favorites** - Save favorite properties for later
- 📝 **Applications** - Submit rental applications with ease
- 🏡 **Residence Tracking** - View current and past residences
- 💳 **Payment Tracking** - Monitor rent payments and due dates

### General Features

- 🔐 **Secure Authentication** - AWS Cognito integration with role-based access
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🎨 **Modern UI** - Beautiful, intuitive design with shadcn/ui components
- 🌍 **Geocoding** - Automatic address to coordinates conversion
- 📊 **Database Viewer** - Built-in web UI for database management

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15.1.6 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI
- **State Management:** Redux Toolkit
- **Maps:** Mapbox GL
- **Forms:** React Hook Form + Zod validation
- **File Uploads:** FilePond

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with PostGIS extension
- **ORM:** Prisma
- **Authentication:** AWS Cognito
- **File Storage:** AWS S3
- **Geocoding:** OpenStreetMap Nominatim API

### DevOps & Tools

- **Version Control:** Git
- **Package Manager:** npm
- **API Testing:** REST endpoints
- **Database Viewer:** Custom Express UI (Port 5000)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher) with PostGIS extension
- npm or yarn
- AWS Account (for Cognito and S3)
- Mapbox Account (for maps)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AshimChoudhary/Enterprise-Level-Rental-app.git
cd Enterprise-Level-Rental-app
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb real_estate_db

# Enable PostGIS extension
psql -d real_estate_db -c "CREATE EXTENSION postgis;"
```

### 3. Server Configuration

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and AWS settings
```

**Server `.env` file:**

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/real_estate_db?schema=public"

# Server Configuration
PORT=3002

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=your-bucket-name
```

### 4. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed
```

### 5. Client Configuration

```bash
cd ../client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

**Client `.env.local` file:**

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002

# AWS Cognito Configuration
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your_client_id

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### 6. Start Development Servers

**Terminal 1 - Backend Server:**

```bash
cd server
OPENSSL_CONF=/dev/null npm run dev
# Server runs on http://localhost:3002
```

**Terminal 2 - Frontend Client:**

```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

**Terminal 3 - Database Viewer (Optional):**

```bash
cd db-viewer
npm install
npm start
# Database UI runs on http://localhost:5000
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3002
- **Database Viewer:** http://localhost:5000

## 🔧 AWS Setup

### AWS Cognito Setup

1. Go to AWS Cognito Console
2. Create a new User Pool
3. Configure user attributes (email, name, phone number)
4. Add custom attribute: `custom:role` (manager or tenant)
5. Create an App Client (disable client secret)
6. Copy User Pool ID and App Client ID to `.env.local`

### AWS S3 Setup

1. Create an S3 bucket for property images
2. Configure bucket permissions for public read access
3. Create IAM user with S3 upload permissions
4. Copy Access Key ID and Secret Access Key to `.env`

### Mapbox Setup

1. Sign up at [Mapbox](https://account.mapbox.com/)
2. Create a new access token
3. Copy token to `.env.local`

## 📁 Project Structure

```
real-estate-prod-master/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   │   ├── (auth)/    # Authentication pages
│   │   │   ├── (dashboard)/ # Manager/Tenant dashboards
│   │   │   └── (nondashboard)/ # Public pages (landing, search)
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and constants
│   │   ├── state/         # Redux store and API
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── migrations/    # Database migrations
│   │   └── seed.ts        # Seed data
│   └── package.json
│
└── db-viewer/             # Database web UI
    ├── server.js
    └── package.json
```

## 🗄️ Database Schema

### Main Tables

- **Property** - Rental listings
- **Location** - Property locations with PostGIS coordinates
- **Manager** - Property managers (linked to Cognito)
- **Tenant** - Tenants (linked to Cognito)
- **Application** - Rental applications
- **Lease** - Lease agreements
- **Payment** - Payment records

### Key Features

- PostGIS integration for geospatial queries
- Automatic geocoding for addresses
- Relationship management with Prisma

## 🔒 Security Features

- JWT-based authentication with AWS Cognito
- Role-based access control (Manager/Tenant)
- Secure password handling via AWS
- Environment variable protection
- API request validation
- CORS configuration

## 🎨 UI Components

Built with modern, accessible components:

- Navigation menus
- Property cards with images
- Interactive maps
- Form controls with validation
- Modal dialogs
- Loading states
- Error handling
- Responsive layouts

## 📝 API Endpoints

### Properties

- `GET /properties` - List properties with filters
- `GET /properties/:id` - Get property details
- `POST /properties` - Create property (Manager only)

### Managers

- `GET /managers/:cognitoId` - Get manager profile
- `PUT /managers/:cognitoId` - Update manager profile
- `GET /managers/:cognitoId/properties` - Get manager properties

### Tenants

- `GET /tenants/:cognitoId` - Get tenant profile
- `PUT /tenants/:cognitoId` - Update tenant profile
- `GET /tenants/:cognitoId/current-residences` - Get current residences
- `POST /tenants/:cognitoId/favorites/:propertyId` - Add favorite
- `DELETE /tenants/:cognitoId/favorites/:propertyId` - Remove favorite

### Applications

- `GET /applications` - List applications
- `POST /applications` - Submit application
- `PUT /applications/:id/status` - Update status (Manager only)

### Leases

- `GET /leases` - List leases
- `GET /properties/:id/leases` - Get property leases
- `GET /leases/:id/payments` - Get lease payments

## 🐛 Troubleshooting

### Common Issues

**Mapbox not loading:**

- Verify `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set correctly
- Check browser console for errors
- Ensure token has proper permissions

**Database connection failed:**

- Verify PostgreSQL is running
- Check `DATABASE_URL` in server `.env`
- Ensure PostGIS extension is enabled

**Property coordinates showing as (0,0):**

- Geocoding may have failed
- Check OpenStreetMap API availability
- Update coordinates manually in database

**AWS Cognito errors:**

- Verify User Pool ID and Client ID
- Check custom:role attribute exists
- Ensure user has proper role assigned

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Ashim Choudhary**

- GitHub: [@AshimChoudhary](https://github.com/AshimChoudhary)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Mapbox for map integration
- AWS for authentication and storage services
- shadcn for beautiful UI components
- Prisma for database management

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

⭐ If you find this project useful, please consider giving it a star!
