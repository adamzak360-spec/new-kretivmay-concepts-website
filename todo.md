# KretivMay Concepts - Project TODO

## Phase 1: Database Schema & Project Structure
- [x] Define database schema for portfolio items, services, blog posts, testimonials, contact submissions
- [x] Create Drizzle migrations for all tables
- [x] Set up tRPC procedures for all features

## Phase 2: Public-Facing Pages
- [x] Home page with hero slideshow, services preview, featured works, testimonials, clients
- [x] About page with company story, mission/vision, services summary, why choose us
- [x] Services page with dedicated sections for each service type
- [x] ServiceDetail page for individual services
- [x] Portfolio/Gallery page with masonry grid, category filters, lightbox
- [x] Photography page with event-specific galleries
- [x] Contact page with form, WhatsApp button, contact details
- [x] Layout component with header, footer, navigation, WhatsApp button, back-to-top
- [x] NotFound page

## Phase 3: Admin Dashboard
- [x] Admin authentication and protected routes
- [x] Dashboard overview with stats
- [x] Portfolio management UI (create, read, update, delete)
- [x] Services management UI
- [x] Blog post management UI
- [x] Contact form submissions viewer
- [x] Image upload with drag-and-drop UI (via tRPC storage helpers)
- [x] Image preview before publishing
- [x] Image categorization system (category field in portfolio)

## Phase 4: Admin Settings
- [x] Update contact info UI
- [x] Update social links UI
- [x] Update homepage hero images (via services management)

## Phase 5: Global UI Features
- [x] Dark mode toggle
- [x] Scroll animations (CSS animations)
- [x] Floating WhatsApp button
- [x] Loading spinner
- [x] Back-to-top button
- [x] Responsive mobile-first design

## Phase 6: Testing & Optimization
- [x] Write vitest tests for critical features
- [x] Test responsive design across devices
- [x] Verify all links and forms work
- [x] Optimize images and lazy loading (lazy loading implemented on all images)
- [x] Create final checkpoint

## Phase 7: Deployment
- [x] Prepare for Vercel deployment
- [x] Verify all environment variables
- [x] Final testing before publish (all tests passing: 23 tests)


## Phase 8: Real-Time Image & Video Upload System
- [x] Create reusable ImageUpload component with drag-and-drop UI
- [x] Implement file upload to S3 via storagePut helper
- [x] Add image upload to Portfolio management with instant preview
- [x] Add image upload to Services management with banner images
- [x] Add image upload to Hero section management
- [x] Add image upload to Photography galleries by event type
- [x] Add image upload to Blog posts with featured images
- [x] Implement real-time database updates and instant website reflection
- [x] Add video upload support for Photography and Blog sections
- [x] Add file validation (size, format, dimensions)
- [x] Add upload progress indicators and error handling
