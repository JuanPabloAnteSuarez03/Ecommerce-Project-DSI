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

export const getMenuItems = async () => {
  try {
    // Realiza la solicitud para obtener el grupo del usuario
    const response = await axiosInstance.get('/users/comprador/');
    const { grupo } = response.data;

    if (grupo === 1) {
      // Si el grupo es 1 (administrador), muestra todos los elementos
      return menuItems;
    }

    // Si no es administrador, filtra los elementos del menú
    return {
      ...menuItems,
      items: menuItems.items.filter(
        (item) => !['dashboard', 'utilities', 'producto'].includes(item.id) // Excluir estos elementos
      ),
    };
  } catch (error) {
    console.error('Error obteniendo grupo del usuario:', error);
    return {
      ...menuItems,
      items: [], // Devuelve un menú vacío en caso de error
    };
  }
};

export default menuItems;



