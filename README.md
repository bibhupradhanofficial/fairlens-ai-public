# FairLens AI 🔍✨

FairLens AI is high-end, premium SaaS platform designed for **AI-powered bias auditing**. It helps data scientists and researchers identify, quantify, and mitigate biases in their datasets through a sophisticated, interactive interface.

## 🚀 Features

- **Automated Bias Auditing**: Upload your CSV datasets and get instant insights into fairness metrics across protected attributes.
- **Interactive Dashboard**: Visualize disparate impact, statistical parity, and other fairness indicators with beautiful Recharts visualizations.
- **Comparative Analysis**: Compare multiple datasets or audit configurations to track improvements over time.
- **Premium UI/UX**: Built with a deep dark mode, glassmorphism aesthetics, and fluid Framer Motion animations.
- **Secure Integration**: Powered by Supabase for secure data handling and Edge Functions for complex analytical computations.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend & Auth**: Supabase
- **Form Management**: React Hook Form & Zod
- **Build Tool**: Bun / Vite

## 🏁 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/)
- Supabase account (for backend features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fairlens-ai.git
   cd fairlens-ai
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   bun dev
   # or
   npm run dev
   ```

## 📂 Project Structure

- `src/components`: Reusable UI components and feature-specific sections.
- `src/hooks`: Custom React hooks for data fetching and state management.
- `src/lib`: Core logic, including CSV parsing and fairness calculations.
- `src/pages`: Main application views (Landing, Dashboard).
- `supabase/functions`: Edge functions for backend analysis.

## 📜 License

This project is licensed under the MIT License.

---

Built with ❤️ by [bibhupradhanofficial](https://github.com/bibhupradhanofficial)
