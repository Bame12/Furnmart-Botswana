# Furnmart Botswana - Modernized E-Commerce Prototype

## 🎓 BIUST Advanced User Interaction Design Project
**Course**: CSI412 - Advanced User Interaction Design  
**Institution**: Botswana International University of Science and Technology  
**Due Date**: October 23, 2025

## 📋 Project Overview

This is a high-fidelity prototype for a modernized e-commerce platform for **Furnmart Botswana**, the country's leading furniture retailer. The project demonstrates advanced HCI concepts including AR/VR furniture visualization, accessibility features (WCAG compliant), and modern UX patterns inspired by IKEA and West Elm.

### Problem Statement
Existing furniture shopping in Botswana lacks:
- Visual confirmation of furniture in actual spaces
- Modern, intuitive user interfaces
- Accessibility for users with disabilities
- Mobile-optimized experiences

### Solution
A modern web application featuring:
- ✅ AR furniture visualization (view products in your space)
- ✅ 360° product views
- ✅ WCAG 2.1 Level AA accessibility compliance
- ✅ Responsive design (mobile-first)
- ✅ Modern IKEA-inspired layout
- ✅ Comprehensive keyboard navigation
- ✅ Screen reader support

## 🏗️ Project Structure

```
Furnmart-Remake/
├── index.html              # Homepage
├── product.html            # Product detail page
├── package.json           # Project dependencies
├── favicon.ico            # Site favicon
├── README.md              # This file
│
├── css/
│   ├── styles.css         # Main stylesheet
│   ├── product.css        # Product page styles
│   └── responsive.css     # Responsive design rules
│
├── js/
│   ├── main.js            # Core functionality
│   └── product.js         # Product page interactions
│
├── images/
│   ├── icons/             # Logo and icons
│   ├── products/          # Product images
│   ├── rooms/             # Room category images
│   └── ar-demo.jpg        # AR feature demonstration
│
└── models/                # 3D models for AR (GLB format)
    └── chair.glb
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for AR features)

### Installation

1. **Clone or extract the project**
   ```bash
   cd Furnmart-Remake
   ```

2. **Install dependencies (optional)**
   ```bash
   npm install
   ```

3. **Run locally**

   **Option A**: Open directly in browser
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

   **Option B**: Use a local server (recommended for AR features)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Access the site**
   ```
   http://localhost:8000
   ```

## 🎨 Design Features

### Color Scheme (Furnmart Brand Colors)
- **Primary Blue**: `#0051A5` - Trust, professionalism
- **Accent Orange**: `#FF6B35` - Call-to-action, energy
- **Neutrals**: Grays and whites for clean, modern feel

### Typography
- **Font Family**: Inter (Google Fonts)
- **Responsive sizing**: Fluid typography using clamp()
- **Readable contrast**: WCAG AAA compliant

### Layout Principles
- **Grid-based**: CSS Grid for flexible layouts
- **Whitespace**: Generous spacing for visual clarity
- **Hierarchy**: Clear visual hierarchy through size and weight
- **Mobile-first**: Designed for mobile, enhanced for desktop

## ♿ Accessibility Features

### WCAG 2.1 Level AA Compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus indicators
- ✅ Skip links
- ✅ ARIA labels and roles
- ✅ Color contrast ratios (4.5:1 minimum)
- ✅ Reduced motion support
- ✅ Text resizing up to 200%
- ✅ Alt text for images
- ✅ Form labels and error handling

### Keyboard Shortcuts
- `Tab` - Navigate forward
- `Shift + Tab` - Navigate backward
- `Enter/Space` - Activate buttons/links
- `Escape` - Close modals/overlays
- `Arrow Keys` - Navigate tabs and carousels

## 🔧 Key Features

### 1. AR Furniture Visualization
- View furniture in your actual space using phone camera
- Accurate size and scale representation
- Powered by Model Viewer (Google)
- Supports iOS (Quick Look) and Android (Scene Viewer)

### 2. Product Browsing
- Grid and list views
- Filter by category, price, color
- Sort by relevance, price, rating
- Search with autocomplete

### 3. Product Details
- High-resolution images
- 360° product views
- Color and size selection
- Customer reviews and ratings
- Specifications table
- Related products

### 4. Shopping Cart
- Add/remove items
- Update quantities
- Persistent storage
- Visual feedback

### 5. Responsive Design
- Mobile: 320px - 480px
- Tablet: 481px - 1023px
- Desktop: 1024px+
- Touch-optimized interactions

## 🧪 Testing Guidelines

### Browser Testing
Test on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility Testing
Tools to use:
1. **Lighthouse** (Chrome DevTools)
    - Run audit for Accessibility score
    - Target: 90+ score

2. **WAVE** (Web Accessibility Evaluation Tool)
    - Check for errors and warnings
    - Verify ARIA implementation

3. **Screen Readers**
    - macOS: VoiceOver (`Cmd + F5`)
    - Windows: NVDA (free) or JAWS
    - Test navigation and announcements

4. **Keyboard Only**
    - Unplug mouse
    - Navigate entire site with keyboard
    - Verify focus indicators

### Usability Testing Protocol
1. **Participants**: 5-8 external users
2. **Tasks**:
    - Find and view a dining chair
    - Use AR to visualize product
    - Add item to cart
    - Navigate to product reviews
    - Complete checkout (prototype)

3. **Metrics**:
    - Task completion rate
    - Time on task
    - Error rate
    - SUS (System Usability Scale) score

## 📊 Usability Testing Results

### Test Metrics (Placeholder for Your Results)
```
Participants: [N]
Task Completion Rate: [X]%
Average Time on Task: [X] seconds
Error Rate: [X]%
SUS Score: [X]/100
```

### Common Feedback Themes
- [Add feedback here]
- [Add feedback here]
- [Add feedback here]

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling (Grid, Flexbox, Custom Properties)
- **JavaScript ES6+**: Vanilla JS, no frameworks
- **Model Viewer**: AR/3D visualization

### Libraries & APIs
- **Google Fonts**: Inter font family
- **Model Viewer**: 3D model rendering and AR
- **Web APIs**: IntersectionObserver, LocalStorage

### Development Tools
- **WebStorm/VS Code**: IDE
- **Git**: Version control
- **Chrome DevTools**: Debugging and testing
- **Lighthouse**: Performance and accessibility audits

## 📱 AR Feature Implementation

### Requirements
- Device with ARCore (Android) or ARKit (iOS)
- Camera permissions
- Modern browser with WebXR support

### 3D Model Format
- **Format**: GLB (GL Transmission Format Binary)
- **Tools**: Blender, SketchUp, or online converters
- **Optimization**: < 5MB per model for fast loading

### Model Viewer Integration
```html
<model-viewer 
    src="models/chair.glb" 
    ar 
    ar-modes="webxr scene-viewer quick-look"
    camera-controls 
    shadow-intensity="1">
</model-viewer>
```

## 🚧 Known Limitations (Prototype)

1. **Backend**: No real database or server-side processing
2. **Authentication**: Simulated login (frontend only)
3. **Payment**: Checkout is prototype (no real transactions)
4. **Inventory**: Static product data
5. **AR Models**: Limited model library
6. **Search**: Basic client-side filtering

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] User accounts and authentication
- [ ] Real-time inventory management
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] AI-powered product recommendations
- [ ] Virtual showroom (full VR experience)
- [ ] Voice search and commands
- [ ] Multi-language support (Setswana)
- [ ] Wishlist synchronization
- [ ] Social sharing features

### Technical Improvements
- [ ] Progressive Web App (PWA)
- [ ] Offline functionality
- [ ] Server-side rendering (SSR)
- [ ] GraphQL API
- [ ] Real-time chat support
- [ ] Analytics integration

## 📚 References & Resources

### Design Inspiration
- IKEA Website: https://www.ikea.com
- West Elm: https://www.westelm.com
- Material Design: https://material.io
- Apple HIG: https://developer.apple.com/design/

### Accessibility Guidelines
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM: https://webaim.org/
- A11y Project: https://www.a11yproject.com/

### AR/VR Resources
- Model Viewer: https://modelviewer.dev/
- ARCore: https://developers.google.com/ar
- ARKit: https://developer.apple.com/augmented-reality/

## 👥 Team Members
[Add your team members here]
- Name 1 - Role
- Name 2 - Role
- Name 3 - Role

## 📝 License
This is an academic project for BIUST. All rights reserved.

## 🙏 Acknowledgments
- Furnmart Botswana for brand inspiration
- BIUST Faculty for guidance
- Test participants for valuable feedback

## 📞 Contact
For questions about this project:
- Email: [your-email@biust.ac.bw]
- Student ID: [your-id]

---

**Note**: This is a prototype developed for educational purposes as part of the CSI412 Advanced User Interaction Design course at BIUST. It demonstrates HCI principles and is not intended for commercial use.