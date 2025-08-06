# Event Contract Management API

A NestJS-based REST API for managing event contracts, suppliers, and client communications.

## Features

- **User Management**: Support for Planners, Clients, and Suppliers
- **Event Management**: Create and manage events with multiple suppliers
- **Contract Tracking**: Real-time contract status updates
- **Email Notifications**: Automated client invitations
- **Real-time Updates**: WebSocket support for live status changes
- **File Uploads**: Support for contract documents
- **Role-based Access**: Different permissions for each user type

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Local Development

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd event-contract-api
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database and email credentials
```

3. **Start PostgreSQL:**
```bash
# Using Docker
docker run -d \
  --name postgres \
  -e POSTGRES_DB=event_contracts \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

4. **Run the application:**
```bash
npm run start:dev
```

### Using Docker Compose

```bash
docker-compose up -d
```

## API Documentation

Once running, visit `http://localhost:3000/api` for Swagger documentation.

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Events
- `GET /events/my-events` - Get user's events
- `POST /events` - Create new event
- `GET /events/:id` - Get event details
- `POST /events/:id/invite-client` - Invite client to event

### Suppliers
- `POST /suppliers` - Add supplier to event
- `GET /suppliers/event/:eventId` - Get event suppliers
- `PUT /suppliers/:id` - Update supplier details

### Contracts
- `POST /contracts` - Create contract
- `PUT /contracts/:id/status` - Update contract status
- `GET /contracts/:id` - Get contract details

## Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'client' 
        CHECK (role IN ('planner', 'client', 'admin')),
    is_email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    venue VARCHAR(255),
    total_budget DECIMAL(10,2) DEFAULT 0,
    planner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'other' 
        CHECK (category IN ('venue', 'catering', 'photography', 'florist', 
                          'music', 'decoration', 'transportation', 'other')),
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    instagram_url VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    UNIQUE(event_id, client_id)
);

CREATE TABLE event_suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    agreed_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, supplier_id)
);

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'sent', 'signed', 'paid', 'completed', 'cancelled')),
    contract_document_url VARCHAR(255),
    deposit_amount DECIMAL(10,2),
    deposit_paid BOOLEAN DEFAULT false,
    due_date DATE,
    terms TEXT,
    notes TEXT,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    event_supplier_id UUID UNIQUE NOT NULL REFERENCES event_suppliers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```


## Email Configuration

Configure SMTP settings in your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

For Gmail, use App Passwords instead of your regular password.

## Testing the API

### Example API Calls

**Register a Planner:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "planner@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "planner"
  }'
```

**Create an Event:**
```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Wedding Reception",
    "description": "Beautiful outdoor wedding",
    "eventDate": "2024-06-15",
    "venue": "Garden Paradise",
    "totalBudget": 15000
  }'
```

**Add a Supplier:**
```bash
curl -X POST http://localhost:3000/suppliers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Elegant Catering",
    "category": "catering",
    "contactName": "Jane Smith",
    "email": "jane@elegantcatering.com",
    "phone": "+1234567890",
    "agreedPrice": 5000,
    "eventId": "YOUR_EVENT_ID"
  }'
```

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with class-validator
- CORS enabled
- Environment variable configuration

## Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-production-secret
```

### Docker Deployment
```bash
# Build and run
docker build -t event-contract-api .
docker run -p 3000:3000 event-contract-api
```