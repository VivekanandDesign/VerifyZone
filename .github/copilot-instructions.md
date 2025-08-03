<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Vzone Project - Copilot Instructions

## Project Overview
This is a static HTML/CSS/JavaScript landing page project with two integrated dashboard applications. The project follows a modern design system with specific color scheme and typography.

## Design System
- **Primary Color**: `#361968` (deep purple)
- **Secondary Color**: `#9967d1` (light purple)
- **Font Family**: Poppins from Google Fonts
- **Design Approach**: Mobile-first responsive design

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Maintain proper heading hierarchy (h1 > h2 > h3)
- Include proper meta tags for responsive design
- Use meaningful class names and IDs

### CSS
- Use CSS custom properties (CSS variables) defined in `:root`
- Follow BEM naming convention for classes where appropriate
- Mobile-first media queries
- Use Flexbox and Grid for layouts
- Maintain consistent spacing using rem units

### JavaScript
- Use ES6+ features
- Follow event delegation patterns
- Use arrow functions for callbacks
- Implement proper error handling
- Add smooth animations and transitions

## Project Structure
- Landing page: Main entry point with hero section and feature showcase
- Dashboard 1: Analytics dashboard with charts and data visualization
- Dashboard 2: Management dashboard with admin tools and user management
- Each dashboard has its own CSS and JS files for modularity

## Key Features to Maintain
- Responsive design across all screen sizes
- Smooth navigation between sections
- Interactive dashboard elements
- Real-time data simulation
- Consistent color scheme and typography
- Accessible design patterns

## When Making Changes
- Test responsiveness on mobile, tablet, and desktop
- Maintain the established color scheme
- Ensure navigation works between all pages
- Keep JavaScript functionality modular
- Update documentation if adding new features
- Verify cross-browser compatibility

## Performance Considerations
- Optimize CSS for fast loading
- Use efficient JavaScript patterns
- Minimize DOM manipulations
- Implement lazy loading where appropriate
- Compress and optimize assets
