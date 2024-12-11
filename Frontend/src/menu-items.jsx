const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/analytics'
        },
        {
          id: 'carrito',
          title: 'Carrito',
          type: 'item',
          icon: 'feather icon-home',
          url: '/carrito'
        },
        {
          id: 'producto',
          title: 'Productos',
          type: 'item',
          icon: 'feather icon-home',
          url: '/productos'
        }, 
        {
          id: 'usuario',
          title: 'Usuario',
          type: 'item',
          icon: 'feather icon-home',
          url: '/usuario'
        }, 
        {
          id: 'ingreso',
          title: 'Ingreso',
          type: 'item',
          icon: 'feather icon-home',
          url: '/ingreso'
        }
      ]
    },

    {
      id: 'auth',
      title: 'Authentication',
      type: 'group',
      icon: 'icon-pages',
      children: [

        {
          id: 'login',
          title: 'Login',
          type: 'item',
          icon: 'feather icon-log-in',
          url: '/auth/login-1',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'reset-pass',
          title: 'Reset Password',
          type: 'item',
          icon: 'feather icon-unlock',
          url: '/auth/reset-password-1',
          target: true,
          breadcrumbs: false
        }
      ]
    }
  ]
}; 

export const getMenuItems = () => {
  const isSuperuser = JSON.parse(localStorage.getItem('is_superuser')); // Retrieve and parse the value

  if (isSuperuser) {
    // Provide the full menu including admin-specific items if needed
    return menuItems;
  }

  // Filter menu items for regular users
  return {
    ...menuItems,
    items: menuItems.items.filter(
      (item) => !['dashboard', 'utilities', 'producto'].includes(item.id) // Exclude these items
    ),
  };
};

export default menuItems;
