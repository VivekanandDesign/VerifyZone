# Independent Dashboard Navbar Component

The `IndependentDashboardNavbar` is a completely self-contained navigation component that can be used across all dashboard pages without any dependencies on external HTML structure.

## Features

- **Truly Independent**: Auto-initializes based on page context
- **Automatic Detection**: Detects V-Zone or X-Zone based on URL path
- **Responsive Design**: Mobile-first approach with hamburger menu
- **Dynamic Menu Generation**: Different menu items for different dashboard types
- **Smart Path Resolution**: Handles relative paths correctly from any subdirectory
- **No Manual Setup Required**: Just include the script and it works

## Basic Usage

### Method 1: Automatic Initialization (Recommended)

Simply include the script in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Dashboard Page</title>
    <link rel="stylesheet" href="../css/global.css">
    <script src="../js/dashboard-navbar-independent.js"></script>
</head>
<body class="dashboard-page">
    <div class="dashboard-container">
        <!-- Your page content goes here -->
        <main class="main-content">
            <!-- Content -->
        </main>
    </div>
</body>
</html>
```

The navbar will automatically:
- Detect if you're in V-Zone (VZoneDashboard) or X-Zone (XZoneDashboard)
- Create appropriate top navbar and sidebar
- Set up all event handlers
- Apply correct active states

### Method 2: Manual Initialization

If you need more control, you can initialize manually:

```html
<script src="../js/dashboard-navbar-independent.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Don't auto-initialize
    window.dashboardNavbar = null;
    
    // Manual initialization with custom config
    window.dashboardNavbar = new IndependentDashboardNavbar({
        dashboardType: 'v-zone', // or 'x-zone'
        currentPage: 'dashboard',
        userProfile: {
            name: 'Jane Doe',
            email: 'jane.doe@verifyzone.com',
            avatar: 'JD'
        }
    });
});
</script>
```

## Configuration Options

### Constructor Options

```javascript
const navbar = new IndependentDashboardNavbar({
    dashboardType: 'v-zone',    // 'v-zone' or 'x-zone'
    currentPage: 'dashboard',   // Current page identifier for active states
    userProfile: {
        name: 'John Doe',
        email: 'john.doe@verifyzone.com',
        avatar: 'JD'           // Initials for avatar
    }
});
```

### Dashboard Types

#### V-Zone Dashboard (VZoneDashboard/)
- Employee verification features
- Rating system
- Verification requests management
- Add employee details

#### X-Zone Dashboard (XZoneDashboard/)
- User management
- System analytics
- Content management
- Security settings

## Public Methods

### Update Current Page
```javascript
window.dashboardNavbar.setCurrentPage('verification');
```

### Update User Profile
```javascript
window.dashboardNavbar.updateUserProfile({
    name: 'Jane Smith',
    email: 'jane.smith@verifyzone.com',
    avatar: 'JS'
});
```

### Toggle Sidebar
```javascript
window.dashboardNavbar.toggleSidebar();
```

## Path Resolution

The component automatically handles different path contexts:

- **From root directory**: `./VZoneDashboard/`, `./XZoneDashboard/`
- **From dashboard subdirectory**: `../`, `./`
- **Cross-dashboard navigation**: Correctly links between V-Zone and X-Zone

## Menu Structure

### V-Zone Menu Items
- Dashboard Overview
- Verification (with submenu)
  - Add Details
  - Simple Add
  - Verification Requests
- Employee Rating
- Test Page
- Back to Home

### X-Zone Menu Items
- Overview
- Analytics
- User Management
- Reports
- Settings
- Back to Home

## Responsive Behavior

- **Desktop**: Full sidebar + top navbar
- **Tablet**: Collapsible sidebar + top navbar
- **Mobile**: Hidden sidebar (toggle via hamburger) + mobile-optimized top navbar

## Events

The component automatically handles:
- Profile dropdown toggle
- Mobile menu toggle
- Sidebar accordion states
- Smooth scrolling effects
- Active state management

## CSS Classes

The component uses these CSS classes from `global.css`:
- `.top-navbar`
- `.sidebar`
- `.nav-link`
- `.nav-accordion`
- `.profile-dropdown`
- `.mobile-menu-toggle`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Migration from Old Navbar

### Before (Old System)
```html
<script src="../js/dashboard-navbar.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const dashboardNavbar = new DashboardNavbar('v-zone');
    // Additional setup code...
});
</script>
```

### After (New Independent System)
```html
<script src="../js/dashboard-navbar-independent.js"></script>
<!-- That's it! No additional setup needed -->
```

## Troubleshooting

### Common Issues

1. **Navbar not appearing**: Ensure `global.css` is loaded
2. **Wrong dashboard type**: Check URL path or set manually
3. **Broken links**: Verify relative path structure
4. **Mobile menu not working**: Check for JavaScript errors

### Debug Mode

Enable debug logging:
```javascript
window.dashboardNavbar.config.debug = true;
```

## Examples

See the updated dashboard pages for implementation examples:
- `/VZoneDashboard/index.html` - V-Zone dashboard
- `/XZoneDashboard/index.html` - X-Zone dashboard
- `/VZoneDashboard/add-exist-details.html` - V-Zone form page
