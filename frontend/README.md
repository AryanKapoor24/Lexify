# Privacy Policy Analyzer - Frontend

A beautiful, modern Next.js frontend for the Privacy Policy Analyzer application.

## Features

### 🏠 Homepage
- **Hero Section**: Eye-catching landing page with gradient backgrounds and animations
- **Feature Showcase**: 6 key features displayed in an attractive grid layout
- **Call-to-Action**: Multiple buttons directing users to the upload page
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 📄 Upload Page
- **Drag & Drop Interface**: Modern file upload with drag-and-drop functionality
- **PDF Validation**: Only accepts PDF files with proper error handling
- **Progress Tracking**: Visual upload progress with percentage indicators
- **File Preview**: Shows selected file details before upload
- **Auto-Navigation**: Automatically redirects to results page after upload
- **Responsive Design**: Optimized for all screen sizes

### 📊 Results Page
- **Side-by-Side Comparison**: Original and simplified text displayed together
- **Multiple View Modes**: Comparison, original-only, and simplified-only views
- **Search Functionality**: Find specific terms across both versions
- **Text Highlighting**: Search terms are highlighted in both texts
- **Analysis Summary**: Key metrics like complexity reduction and reading time
- **Export Options**: Download results as PDF (placeholder)
- **Responsive Layout**: Works perfectly on all devices

### 🎨 Design System
- **Modern UI**: Clean, professional design with gradient accents
- **Dark Mode Support**: Automatic dark/light mode switching
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Component-Based**: Reusable components for maintainability

## Components

### Header
- Logo with gradient background
- Navigation links
- Conditional upload button

### Footer
- Company information
- Links to legal pages
- Social media links (placeholder)

### FeatureCard
- Reusable card component for features
- Customizable icons and colors
- Hover animations

### UploadArea
- Drag and drop functionality
- File validation
- Progress indicators
- File preview

### ComparisonView
- Side-by-side text comparison
- Search highlighting
- Difference highlighting
- Responsive layout

## Tech Stack

- **Next.js 15.5.5**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **Tailwind CSS 4**: Utility-first CSS framework
- **Geist Font**: Modern typography
- **ESLint**: Code linting and formatting

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout with metadata
│   │   ├── page.js            # Homepage
│   │   ├── upload/
│   │   │   └── page.js        # Upload page
│   │   ├── results/
│   │   │   └── page.js        # Results comparison page
│   │   └── globals.css        # Global styles and animations
│   └── components/
│       ├── Header.js          # Navigation header
│       ├── Footer.js          # Site footer
│       ├── FeatureCard.js     # Feature display card
│       ├── UploadArea.js      # File upload component
│       └── ComparisonView.js   # Side-by-side comparison component
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Features Implemented

✅ **Homepage with Features**
- Beautiful hero section with gradient text
- 6 feature cards with icons and descriptions
- Call-to-action sections
- Responsive grid layout

✅ **Upload Page**
- Drag and drop file upload
- PDF file validation
- Upload progress tracking
- File preview and removal
- Step-by-step process explanation
- Auto-navigation to results

✅ **Results Page**
- Side-by-side text comparison
- Multiple view modes (comparison, original, simplified)
- Search functionality with highlighting
- Analysis summary with key metrics
- Export options (placeholder)
- Responsive design

✅ **Reusable Components**
- Modular component architecture
- Consistent styling
- Easy to maintain and extend

✅ **Modern Design**
- Gradient backgrounds
- Smooth animations
- Dark mode support
- Mobile responsive

✅ **User Experience**
- Intuitive navigation
- Clear visual feedback
- Loading states
- Error handling

## Next Steps

The frontend is ready for backend integration. The upload page includes placeholder API calls that can be easily connected to your backend API endpoints.

## Customization

- **Colors**: Modify CSS variables in `globals.css`
- **Components**: Update individual component files
- **Styling**: Use Tailwind classes or add custom CSS
- **Content**: Edit text and images in component files