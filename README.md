# Expertline

> **F1 for coders. C1 for your projects.**

Stop searching endlessly for better code solutions. Expertline is your developer companion — a platform that helps you find the **best code options**, backed by documentation, industry experts, and AI insights.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

## Features

### **AI Mode** - Powered by Google Gemini Flash 2.5
- Get instant, intelligent code alternatives
- Compare different programming approaches
- See pros and cons for performance, scalability, and complexity
- Complete working code examples with explanations

### **Expert Mode** - Community-Driven Insights
- Access expert opinions from developers worldwide
- Community-voted solutions with endorsement/opposition system
- Real-world implementations from experienced developers
- Detailed comparisons with performance metrics

### **Smart Analysis**
- Advanced keyword extraction and algorithm pattern detection
- Automatic code complexity analysis
- Technology stack recognition
- Performance optimization suggestions

### **Developer Tools**
- **VS Code Extension** - Select code and press `ALT + X` for instant analysis
- RESTful API for seamless integration
- Copy code and share URLs functionality
- Social features: endorse, oppose, comment, and build reputation

## Perfect For

- **Developers** looking for better code approaches
- **Teams** wanting to standardize coding practices
- **Students** learning different programming paradigms
- **Code reviewers** comparing implementation strategies
- **Open source contributors** seeking best practices

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/alichohan1999/expertline.git
cd expertline
npm install
```

### 2. Environment Setup

```bash
cp env.sample .env
```

Configure your `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expertline_db"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
BASE_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Integration
GOOGLE_GEMINI_API_KEY="your-google-gemini-api-key"
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Expertline in action!

## 🎮 How to Use

### Web Interface
1. **Visit Expertline** and paste your code
2. **Choose your mode**: AI Mode for instant alternatives or Expert Mode for community insights
3. **Compare alternatives** with detailed pros and cons
4. **Copy the best solution** for your project

### VS Code Extension
1. **Install the Expertline VS Code extension**
2. **Select your code** in the editor
3. **Press `ALT + X`** and let Expert Mode do the work
4. **Get instant alternatives** without leaving your editor

### Community Features
1. **Create posts** with your expert solutions
2. **Select relevant topics** for better discoverability
3. **Engage with the community** - endorse, oppose, and comment
4. **Build your reputation** and level up your expertise

## 🔧 API Usage

### Compare Code Endpoint

**POST** `/api/compare`

```javascript
const response = await fetch('/api/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
    details: "Recursive fibonacci implementation",
    mode: "ai", // or "expert"
    maxAlternatives: 3
  })
});

const data = await response.json();
console.log(data.comparisons);
```

**Response Example:**
```javascript
{
  "mode": "ai",
  "comparisons": [
    {
      "name": "Iterative Approach",
      "summary": "Loop-based implementation for better performance",
      "pros": ["Better performance", "No stack overflow", "Memory efficient"],
      "cons": ["More code", "Less intuitive"],
      "complexity": "low",
      "codeBlock": "function fibonacci(n) { /* optimized code */ }",
      "referenceLink": "https://developer.mozilla.org/...",
      "referenceType": "external"
    }
  ],
  "message": "AI generated 3 code alternatives using Google Gemini"
}
```

## Community Features

### Join the Expertline Developer Community

- **Create Posts**: Share your solutions and get feedback
- **Topic-Based Organization**: Categorize posts by technology and approach
- **Voting System**: Endorse or oppose solutions based on quality
- **Reputation System**: Build your expertise level in the community
- **Comments & Discussion**: Engage with other developers
- **Social Sharing**: Copy URLs and share your favorite solutions

### Building Your Reputation

1. **Create quality posts** with well-documented code
2. **Engage with the community** through comments and discussions
3. **Endorse good solutions** and provide constructive feedback
4. **Share knowledge** and help other developers grow
5. **Level up** as you contribute to the community

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: Google Gemini Flash 2.5
- **Deployment**: Vercel-ready with environment configuration

## Deployment

### Environment Variables for Production

```env
NODE_ENV="production"
BASE_URL="https://yourdomain.com"
NEXTAUTH_URL="https://yourdomain.com"
DATABASE_URL="your-production-database-url"
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Follow the existing code style

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Google Gemini** for AI-powered code analysis
- **Next.js team** for the amazing framework
- **Prisma** for the excellent ORM
- **Community contributors** for their valuable insights

## Support

- **Issues**: [GitHub Issues](https://github.com/alichohan1999/expertline/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alichohan1999/expertline/discussions)
- **Email**: www.alichohan1999@gmail.com

---

**Expertline. F1 for coders. C1 for your projects.**

*Sign up today and join the developer community that's revolutionizing how we approach code solutions.*