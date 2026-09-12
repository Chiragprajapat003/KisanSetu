# 🌾 KisanSetu (किसान सेतु) - Direct Farm-to-Table Ecosystem

![KisanSetu Banner](https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=3200&auto=format&fit=crop)

> **Empowering farmers and connecting them directly with consumers through AI-driven intelligence, microservices architecture, and real-time commerce.**  
> KisanSetu bridges the gap between Indian agriculture and modern consumers, ensuring fair pricing for farmers, transparent sourcing, optimized logistics, and fresh produce for buyers.

---

## 🌟 Key Pillars of KisanSetu

### 👨‍🌾 For Farmers & Producers
* **Interactive Dashboard & Analytics**: Real-time overview of revenue, sales trends, stock inventory, and active customer orders.
* **Product Catalog Management**: Quick listing and updates for fresh produce, pricing per kg/unit, stock levels, and quality attributes.
* **🚚 Smart AI Route Optimization**:
  * **Intelligent Routing**: Calculates optimal multi-stop delivery routes using nearest-neighbor & graph heuristics.
  * **Dynamic Navigation**: Turn-by-turn stop sequencing to minimize travel time, fuel costs, and spoilage.
  * **Geospatial Estimates**: Haversine distance calculations and estimated time of arrival (ETA).
* **Order & OTP Verification**: Direct order state machine (`Pending` → `Processing` → `Shipped` → `Delivered`) with OTP confirmation.
* **Direct Real-time Chat**: Direct farmer-to-buyer communication for negotiations, customized deliveries, and order updates.

### 🛒 For Consumers & Buyers
* **Direct Farmer Marketplace**: Explore fresh farm produce sourced directly from local verified farmers.
* **Geotagged Farmer Profiles**: View farm origins, distance, customer ratings, and farming practices.
* **Secure Multi-mode Payments**: Integrated UPI, QR verification, and cash-on-delivery tracking.
* **Live Order Tracking**: End-to-end transparency from farm harvest to doorstep delivery.
* **Farmer Direct Negotiation**: In-app real-time messaging with instant notifications.

### 🤖 AI Agricultural Advisory & Assistant
* **AI Chat Assistant**: Context-aware agricultural insights, weather advisory, crop health tips, and market price benchmarks.
* **Smart Recommendations**: Helps farmers price produce competitively and buyers discover seasonal produce.

---

## 🏗️ Architecture & Technology Stack

KisanSetu is built on a scalable **Microservices Architecture**:

```
                  ┌─────────────────────────────────────────┐
                  │          React Frontend (Vite)          │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            API Gateway (Proxy)          │
                  └──────┬─────────────┼─────────────┬──────┘
                         │             │             │
        ┌────────────────┼─────────────┼─────────────┼────────────────┐
        ▼                ▼             ▼             ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────┐
│ Auth Service │ │ User Service │ │  Product  │ │   Order   │ │   Payment    │
│              │ │              │ │  Service  │ │  Service  │ │   Service    │
└──────────────┘ └──────────────┘ └───────────┘ └───────────┘ └──────────────┘
        │                │             │             │                │
        ▼                ▼             ▼             ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────────────────────────────┐
│Communication │ │ Feedback &   │ │       AI Connection & Intelligence       │
│(Socket/Chat) │ │ Review Svc   │ │             (Python / FastAPI)           │
└──────────────┘ └──────────────┘ └──────────────────────────────────────────┘
```

### Tech Stack Details

* **Frontend**: React 18, Vite, React Router 6, React Leaflet (OpenStreetMap), Socket.io Client, Lucide/React Icons.
* **API Gateway & Microservices**: Node.js, Express.js, Express Http Proxy, JWT Authentication, CORS.
* **AI Engine**: Python 3, FastAPI / LangChain / AI Agent tools.
* **Database**: MongoDB with Mongoose ODM (Geospatial 2dsphere indexing).
* **Real-time Engine**: Socket.io for live messaging, order status updates, and notifications.
* **DevOps & Containerization**: Docker, Docker Compose, Nginx, GitHub Actions CI/CD workflows.

---

## 📁 Repository Structure

```
KisanSetu/
├── .github/                  # CI/CD Workflows, issue templates, PR templates
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   └── ISSUE_TEMPLATE/
├── client/                   # Vite + React single-page frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Modal, Maps, etc.)
│   │   ├── contexts/         # React contexts (AuthContext, SocketContext)
│   │   ├── pages/            # Page views (Home, Marketplace, Dashboard, Orders, Chat)
│   │   ├── services/         # API clients & service integrations
│   │   └── styles/           # CSS modules and design system
│   ├── Dockerfile
│   └── vite.config.js
├── docs/                     # Architecture, API specifications, and setup docs
│   ├── api/
│   ├── deployment/
│   └── development/
├── services/                 # Backend microservices
│   ├── gateway/              # Reverse proxy and route dispatcher
│   ├── auth/                 # User authentication & token service
│   ├── user/                 # Profile, farmer credentials & KYC management
│   ├── product/              # Produce catalog and inventory management
│   ├── order/                # Order lifecycle & route optimization engine
│   ├── payment/              # Payment processing & QR reconciliation
│   ├── communication/        # Real-time WebSocket messaging service
│   ├── feedback/             # Rating & review aggregation service
│   ├── ai_connection/        # AI Copilot & farming recommendation service
│   └── shared/               # Shared utilities, middleware, and constants
├── docker-compose.yml        # Orchestration configuration for all services
├── start-all.ps1             # Local development startup script
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
* **Node.js**: v18.0.0+
* **npm**: v9.0.0+
* **Python**: v3.10+ (for AI service)
* **MongoDB**: Local instance or MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/anand880441-source/KisanSetu.git
cd KisanSetu
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root directory as well as inside each service folder:
```bash
cp .env.example .env
```

### 3. Launch with Docker Compose
```bash
docker-compose up --build
```

### 4. Or Run Locally via PowerShell
```powershell
./start-all.ps1
```

Access the frontend application at `http://localhost:5173` and the API Gateway at `http://localhost:5000`.

---

## 🛡️ Security & Quality

* **JWT Verification**: Token-based authentication with role-based access control (Farmer, Consumer, Admin).
* **Data Sanitization**: MongoDB schema validation and input sanitization.
* **OTP Verification**: Strict two-factor state transitions for order fulfillment.

---

## 🤝 Contributing

Contributions are welcome! Please check out the [Contributing Guidelines](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---
**Built with ❤️ for Indian Farmers & Agriculture Ecosystem**