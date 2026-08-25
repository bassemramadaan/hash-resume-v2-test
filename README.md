# Hash Resume (صانع السيرة الذاتية الذكي المتوافق مع ATS)

> **Hash Resume** is a modern, high-performance, ATS-friendly resume builder tailored for professionals in the Egyptian, Arab, and international job markets. It features intelligent AI assistance, multilingual support (Arabic, English, French), real-time ATS compatibility scoring, local privacy-first storage, and transparent one-time payment options.

---

## 🌟 Key Features

- **100% ATS-Compliant Templates**: Architected with standard typography, vector-compatible layouts, single-page print optimization, and full Right-to-Left (RTL) Arabic support.
- **Multilingual Support**: Seamless switching between Arabic (`ar`), English (`en`), and French (`fr`) with localized prompts and terminology.
- **Interactive Step-by-Step Flow**:
  - Personal Information (`بياناتك`)
  - Experience & Career History (`الخبرات`)
  - Skills & Competencies (`المهارات`)
  - Review & Final Polish (`المراجعة`)
  - Instant PDF Download (`التحميل`)
- **Intelligent Keyword & Red Flag Detection**:
  - Role-specific keyword suggestions for Engineers, Accountants, Doctors, Marketers, etc.
  - Automatic detection of sensitive/prohibited data (e.g. religion, marital status, national ID) to prevent ATS discrimination.
  - Identification of employment gaps with actionable suggestions.
- **Local Data Privacy**: All resume draft data is stored exclusively in your browser via `localStorage`. No personal data is stored server-side.
- **Transparent Pricing Model**:
  - **Single Download**: 50 EGP (one-time payment, no recurring subscriptions).
  - **3-Downloads Bundle**: 120 EGP (save 30 EGP, 3 separate activation keys).
- **JSON Backup & Import**: Easily backup your resume as a `.json` file and restore it on any device.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd hash-resume
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the automated test suite covering ATS scoring, persistence, and parsing:
```bash
npm test
```

To run TypeScript linting:
```bash
npm run lint
```

To build for production:
```bash
npm run build
```

---

## 🤝 Contribution Guidelines

1. **RTL & Localization**: When adding new templates or components, always ensure support for both LTR and RTL layouts (`dir="rtl"` / `dir="ltr"`).
2. **ATS Integrity**: Avoid multi-column text tables or nested canvas structures inside resume export templates.
3. **Privacy First**: Keep client data in local storage and never transmit sensitive information without explicit user action.
