# HisaabScore - Financial Passport for the Informal Economy

> **AI-Powered Alternative Credit Scoring for 2+ Billion Unbanked People Worldwide**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)](https://firebase.google.com/)
[![Google Genkit](https://img.shields.io/badge/Genkit-1.20-green)](https://firebase.google.com/docs/genkit)

---

## 🌟 Overview

**HisaabScore** is a revolutionary fintech platform that provides alternative credit scores for gig workers, street vendors, freelancers, and informal economy workers who lack traditional credit history. Unlike FICO or VantageScore which require credit cards and bank loans, HisaabScore analyzes everyday financial behaviors to create fair, accessible credit scores.

### The Problem
- **2+ billion people** worldwide are excluded from traditional credit systems
- Traditional credit scoring requires credit cards, bank loans, and formal banking history
- Informal economy workers (gig workers, street vendors, freelancers) have no way to prove creditworthiness
- This prevents access to loans, financing, and financial services

### Our Solution
HisaabScore uses AI to analyze:
- 📱 Mobile wallet transactions
- 💰 Income consistency patterns  
- 💳 Bill payment history (rent, utilities, mobile)
- 📊 Expense management and savings behavior
- 📈 Financial growth trends over time

---

## ✨ Core Features

### 1. 🤖 AI-Powered Document Processing
- **Drag-and-drop upload** for receipts, bills, and statements
- **OCR extraction** using Google Gemini 2.0 Flash
- **Automatic transaction detection** from images and PDFs
- **Smart categorization** into 12+ categories with confidence scoring
- **Real-time processing** with status tracking

**Supported Documents:**
- Receipts (retail, restaurant, services)
- Utility bills (electricity, water, internet)
- Mobile wallet statements (M-Pesa, PayTM, etc.)
- Bank statements
- Rent receipts

### 2. 📊 Alternative Credit Scoring (0-1000 Scale)

Our proprietary algorithm evaluates 5 key factors:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| **Bill Payment History** | 30% | On-time payments for rent, utilities, mobile bills |
| **Income Consistency** | 25% | Regular earning patterns and income stability |
| **Expense Management** | 20% | Spending discipline, savings rate, financial control |
| **Financial Growth** | 15% | Income trend over 3-6 months, upward trajectory |
| **Transaction Diversity** | 10% | Multiple income sources, diversified earnings |

**Score Ranges:**
- **A (800-1000)**: Excellent - Very low risk
- **B+ (700-799)**: Good - Low risk  
- **B (600-699)**: Fair - Moderate risk
- **C (500-599)**: Needs improvement - Higher risk
- **D (<500)**: Poor - High risk

### 3. 📈 Comprehensive Dashboard

**Financial Overview:**
- Total income, expenses, and net profit
- Real-time credit score with animated gauge
- Pending transactions counter
- Financial health metrics

**Visual Analytics:**
- Income vs Expense bar chart (last 6 months)
- Category breakdown pie chart
- Top 5 income sources
- Recent transaction history

**Smart Insights:**
- Spending pattern analysis
- Savings recommendations
- Score improvement tips

### 4. 💬 AI Finance Chatbot

**Conversational AI Advisor:**
- Analyzes your transaction history
- Answers questions about spending patterns
- Provides personalized budgeting advice
- Offers financial tips and recommendations
- Context-aware responses based on your data

**Example Queries:**
- "Analyze my spending patterns"
- "What's my total income this month?"
- "Give me saving tips"
- "How can I improve my credit score?"

### 5. 📄 Professional Credit Reports

**Generate Bank-Ready Reports:**
- Detailed credit score breakdown
- Income and expense analysis
- Payment history summary
- Risk grade assessment
- Personalized recommendations

**Export Options:**
- PDF download for lenders
- Shareable report links (coming soon)
- Password-protected access (coming soon)

### 6. 💳 Transaction Management

**Complete Transaction Control:**
- View all income and expenses
- Filter by merchant, type, category
- Search functionality
- Pagination for large datasets
- Real-time updates from Firestore

**Transaction Categories:**
- Income: Sales, Services, Gig Work, Remittances
- Expenses: Inventory, Rent, Utilities, Transport, Food, Supplies

### 7. 🔐 Secure Authentication

**Email-Based Authentication:**
- Email/password signup and login
- Email verification required
- Password reset functionality
- Forgot password flow
- Auth guards on protected routes

**Security Features:**
- Firebase Authentication
- Firestore security rules
- User data isolation
- Protected API routes

### 8. 📱 Mobile-First Design

**Optimized for Low-End Devices:**
- Responsive layout (mobile, tablet, desktop)
- Fast loading on 3G networks
- Optimized for Android devices
- Touch-friendly interface
- Minimal data usage

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful component library
- **Recharts** - Data visualization
- **Lucide Icons** - Modern icon set

### Backend & AI
- **Firebase** - Authentication, Firestore database, hosting
- **Google Genkit 1.20** - AI orchestration framework
- **Gemini 2.0 Flash** - Document processing and chat
- **Zod** - Schema validation
- **jsPDF** - PDF generation

### Development Tools
- **Turbopack** - Fast bundler
- **ESLint** - Code linting
- **TypeScript** - Static type checking

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Google AI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hisaabscore.git
cd hisaabscore
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local` file:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI
GOOGLE_GENAI_API_KEY=your_google_ai_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:9003
```

4. **Deploy Firestore rules**
```bash
firebase deploy --only firestore:rules
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:9003
```

### Development Commands

```bash
# Start dev server with Turbopack
npm run dev

# Test AI flows with Genkit UI
npm run genkit:dev

# Type checking
npm run typecheck

# Production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
hisaabscore/
├── src/
│   ├── ai/                          # AI flows and configuration
│   │   ├── genkit.ts               # Genkit setup
│   │   └── flows/
│   │       ├── calculate-credit-score.ts
│   │       ├── categorize-transactions.ts
│   │       ├── extract-transactions-from-document.ts
│   │       └── finance-chat.ts
│   ├── app/
│   │   ├── (auth)/                 # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── verify-email/
│   │   │   └── resend-verification/
│   │   ├── (app)/                  # Protected app pages
│   │   │   ├── dashboard/          # Main dashboard
│   │   │   ├── documents/          # Document upload
│   │   │   ├── transactions/       # Transaction list
│   │   │   ├── reports/            # Credit reports
│   │   │   └── settings/           # User settings
│   │   ├── api/                    # API routes
│   │   │   ├── create-user-profile/
│   │   │   ├── generate-report/
│   │   │   └── generate-pdf/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ui/                     # Shadcn components
│   │   ├── app-header.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── auth-guard.tsx
│   │   ├── finance-chatbot.tsx
│   │   ├── score-gauge.tsx
│   │   ├── score-breakdown.tsx
│   │   └── charts.tsx
│   ├── firebase/                   # Firebase configuration
│   │   ├── config.ts
│   │   ├── provider.tsx
│   │   └── firestore/
│   ├── lib/
│   │   ├── types.ts                # TypeScript types
│   │   ├── credit-analysis.ts      # Credit scoring logic
│   │   ├── pdf-generator.ts        # PDF generation
│   │   └── firebase/               # Firebase utilities
│   └── hooks/                      # Custom React hooks
├── public/                         # Static assets
├── documentation/                  # All documentation
├── firestore.rules                 # Firestore security rules
├── firebase.json                   # Firebase configuration
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
└── package.json                    # Dependencies
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `HSL(49, 100%, 50%)` - Vibrant yellow (#FFDA63)
- **Background**: `HSL(53, 26%, 92%)` - Light warm (#F7F4EC)
- **Accent**: `HSL(19, 92%, 51%)` - Bright orange (#F1711E)

### Typography
- **Headlines**: Poppins (geometric sans-serif)
- **Body**: PT Sans (humanist sans-serif)

### Design Principles
- Mobile-first responsive layout
- Clear visual hierarchy
- Consistent spacing and padding
- Accessible color contrast
- Subtle animations with Framer Motion

---

## 🔒 Security & Privacy

### Data Protection
- User data isolated per Firebase user ID
- Firestore security rules enforce ownership
- No cross-user data access
- Encrypted data transmission

### Authentication
- Email verification required
- Secure password hashing
- Password reset flow
- Session management

### Privacy
- No data sharing with third parties
- User controls their own data
- Data deletion on account removal
- GDPR-compliant practices

---

## 📊 Credit Scoring Algorithm

### How It Works

The alternative credit score is calculated using a weighted average of 5 factors:

```
Credit Score = (
  Bill Payment History × 0.30 +
  Income Consistency × 0.25 +
  Expense Management × 0.20 +
  Financial Growth × 0.15 +
  Transaction Diversity × 0.10
) × 10
```

### Factor Calculations

**1. Bill Payment History (0-100)**
- Identifies regular payments (rent, utilities, mobile)
- Measures payment consistency month-over-month
- Rewards on-time payment patterns

**2. Income Consistency (0-100)**
- Calculates coefficient of variation in monthly income
- Lower variation = higher score
- Bonus for multiple months of income

**3. Expense Management (0-100)**
- Expense-to-income ratio
- Rewards saving behavior
- Penalizes overspending

**4. Financial Growth (0-100)**
- Compares first month vs last month income
- Positive growth = higher score
- Stable income = moderate score

**5. Transaction Diversity (0-100)**
- Counts unique income categories
- Counts unique merchants/clients
- Rewards diversified income sources

---

## 🌍 Use Cases & Target Users

### Who Benefits?

**Gig Workers**
- Uber/Lyft drivers
- Food delivery riders
- Freelance professionals
- Task-based workers

**Small Business Owners**
- Street vendors
- Market sellers
- Home-based businesses
- Mobile shop owners

**Informal Workers**
- Domestic workers
- Construction workers
- Agricultural workers
- Artisans and craftspeople

### What Can They Access?

- Microloans from alternative lenders
- Mobile wallet credit limits
- Merchant financing programs
- Rent-to-own schemes
- P2P lending platforms
- Buy-now-pay-later services

---

## 🚧 Roadmap & Future Features

### Phase 1: Core Platform (✅ Complete)
- [x] AI document processing
- [x] Alternative credit scoring
- [x] Transaction management
- [x] Dashboard analytics
- [x] Credit report generation
- [x] AI chatbot advisor

### Phase 2: Enhanced Features (🔄 In Progress)
- [ ] Camera-based document scanning
- [ ] Shareable credit report links
- [ ] Password-protected reports
- [ ] Access tracking for shared reports
- [ ] Multi-language support
- [ ] Dark mode

### Phase 3: Advanced Analytics (📋 Planned)
- [ ] Predictive income forecasting
- [ ] Spending pattern alerts
- [ ] Budget recommendations
- [ ] Goal tracking (savings, debt reduction)
- [ ] Financial health score
- [ ] Comparison with similar users

### Phase 4: Integration & Partnerships (🔮 Future)
- [ ] Lender marketplace integration
- [ ] Mobile wallet API connections
- [ ] Bank statement import
- [ ] Credit bureau reporting
- [ ] Loan application tracking
- [ ] Financial product recommendations

---

## 💡 Suggested Improvements

### 1. **Enhanced Document Processing**
- **Batch upload**: Upload multiple documents at once
- **Document templates**: Pre-configured templates for common document types
- **Manual entry**: Allow manual transaction entry for cash transactions
- **Receipt scanning**: Real-time camera scanning with instant feedback
- **Document history**: View original documents alongside extracted transactions

### 2. **Advanced Credit Features**
- **Credit score simulator**: "What-if" scenarios to see score impact
- **Score history tracking**: Graph showing score changes over time
- **Factor breakdown**: Detailed explanation of each factor's contribution
- **Improvement roadmap**: Step-by-step plan to improve score
- **Peer comparison**: Anonymous comparison with similar users

### 3. **Financial Planning Tools**
- **Budget creation**: Set monthly budgets by category
- **Expense alerts**: Notifications when approaching budget limits
- **Savings goals**: Track progress toward financial goals
- **Bill reminders**: Automated reminders for recurring payments
- **Cash flow forecasting**: Predict future income and expenses

### 4. **Social & Sharing Features**
- **Shareable reports**: Generate unique links for lenders
- **Access control**: Set expiration dates and view limits
- **View analytics**: See who viewed your report and when
- **Lender directory**: Browse and connect with alternative lenders
- **Success stories**: Share anonymized success stories

### 5. **Mobile App**
- **Native iOS/Android apps**: Better performance and offline support
- **Push notifications**: Real-time alerts for transactions and score changes
- **Biometric authentication**: Face ID / fingerprint login
- **Offline mode**: Queue uploads when offline
- **Widget support**: Quick view of credit score on home screen

### 6. **AI Enhancements**
- **Smarter categorization**: Learn from user corrections
- **Fraud detection**: Flag suspicious transactions
- **Income prediction**: Forecast next month's income
- **Expense optimization**: AI-powered spending recommendations
- **Natural language queries**: Ask complex questions about finances

### 7. **Integration Ecosystem**
- **Mobile wallet sync**: Auto-import from M-Pesa, PayTM, etc.
- **Bank account linking**: Connect bank accounts via Plaid/Yodlee
- **Accounting software**: Export to QuickBooks, Xero
- **E-commerce platforms**: Import sales from Shopify, WooCommerce
- **Payment processors**: Connect Stripe, PayPal, Square

### 8. **Gamification & Engagement**
- **Achievement badges**: Earn badges for financial milestones
- **Streak tracking**: Consecutive months of good behavior
- **Leaderboards**: Anonymous rankings (opt-in)
- **Challenges**: Weekly/monthly financial challenges
- **Rewards program**: Points for using the platform

### 9. **Educational Content**
- **Financial literacy**: In-app tutorials and guides
- **Video tutorials**: How to improve credit score
- **Blog/articles**: Financial tips for informal workers
- **Webinars**: Live sessions with financial experts
- **Community forum**: User discussions and support

### 10. **Enterprise Features**
- **Lender dashboard**: Tools for lenders to review applications
- **API access**: Allow lenders to integrate credit checks
- **Bulk verification**: Process multiple applications
- **Risk analytics**: Advanced risk assessment tools
- **White-label solution**: Branded version for partners

### 11. **Compliance & Trust**
- **Credit bureau reporting**: Report to traditional bureaus
- **Regulatory compliance**: Meet local financial regulations
- **Third-party audits**: Independent verification of algorithm
- **Transparency reports**: Publish scoring methodology
- **User data export**: GDPR-compliant data portability

### 12. **Performance Optimizations**
- **Progressive Web App (PWA)**: Installable web app
- **Image optimization**: Compress uploaded documents
- **Lazy loading**: Load components on demand
- **Caching strategy**: Reduce API calls
- **CDN integration**: Faster global access

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🌍 Translate to new languages
- 🎨 Design improvements

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure build passes (`npm run build`)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Genkit** - AI orchestration framework
- **Firebase** - Backend infrastructure
- **Shadcn/ui** - Beautiful component library
- **Vercel** - Deployment platform
- **Open source community** - For amazing tools and libraries

---

## 📞 Contact & Support

- **Website**: [hisaabscore.com](https://hisaabscore.com)
- **Email**: support@hisaabscore.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@hisaabscore](https://twitter.com/hisaabscore)

### Get Help
- 📖 [Documentation](./documentation/)
- 💬 [Community Forum](https://github.com/yourusername/hisaabscore/discussions)
- 🐛 [Report Issues](https://github.com/yourusername/hisaabscore/issues)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ for financial inclusion**

*Empowering 2+ billion unbanked people worldwide*
