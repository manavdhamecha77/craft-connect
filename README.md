# Craft-Connect

**Slogan:** *Connecting local artisans to global audiences with AI*

Craft-Connect is an **AI-powered marketplace platform** that helps local artisans create, market, and sell their crafts online. It combines AI tools with a marketplace ecosystem to simplify product listing, storytelling, pricing, and marketing for artisans, while allowing users to discover and purchase authentic handmade products.

---

## Features

### For Artisans
- **Catalog Builder:** Generate product titles, descriptions, keywords, and translations (English, Hindi, Gujarati) from basic inputs like name, category, image, and notes.
- **StoryTeller Behind the Art:** AI-generated unique stories for artisans, communities, and regions.
- **Price Suggestions:** Smart price recommendations based on material, size, and effort.
- **Marketing Content Generator:** AI-generated Instagram captions, WhatsApp statuses, and 30s ad scripts in multiple languages.
- **Trend Analysis:** Insights into trending products and categories to guide sales and marketing.
- **Chatbot Support:** AI assistant to answer questions and guide artisans in using the platform.
- **Product Management:** Save drafts, finalize pricing (smart or manual), and push products to the marketplace.

### For Users
- Browse and purchase authentic artisan products.
- Follow artisans to receive updates on new products and stories.
- Personalized recommendations using trend analysis insights.

### Admin
- Manage artisans, products, and marketplace activity.
- Access analytics and monitor platform usage.

---

## Technology Stack
- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Backend & Auth:** Firebase (Authentication, Firestore)
- **AI Integration:** Gemini 2.0 Flash API for content generation and insights

---

## Pages & Layout

- **Homepage:** Hero section, featured products, artisan spotlight, CTA buttons.
- **AI Tools:** Dropdown menu for all AI features (Catalog Builder, StoryTeller, Price Suggestions, Marketing Content, Trend Analysis).
- **Marketplace:** Product grid with filters, product details, and follow/buy functionality.
- **Dashboards:** Separate dashboards for artisans (product management, analytics, AI tools) and users (purchases, following, activity).
- **Profiles:** Public profiles for artisans and users with product showcase and activity.
- **Chatbot:** Floating AI assistant for guidance and queries.

---

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/craft-connect.git](https://github.com/yourusername/craft-connect.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd craft-connect
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Firebase:**
    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - In your project, create a new Web App.
    - Copy the Firebase configuration object.
    - Create a `.env.local` file in the root of your project and add your Firebase credentials:
      ```
      NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
      ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```

6.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

---

## Future Enhancements

- Multi-currency support for international buyers.
- AI-powered image enhancement and product mockups.
- Gamification: rewards, top artisans, badges.
- More languages for broader reach.

---

## Impact

Craft-Connect enables artisans to reduce listing time by ~80%, expand digital reach, and sell authentic handmade crafts to a wider audience while using AI to simplify complex tasks.

---

## License

This project is licensed under the MIT License.
