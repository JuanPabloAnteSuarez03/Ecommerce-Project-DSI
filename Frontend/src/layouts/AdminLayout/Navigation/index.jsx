import React, { useContext, useState, useEffect } from 'react';

// project import
import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';

import NavContent from './NavContent';
import { getMenuItems } from '../../../menu-items'; // Assuming getMenuItems is exported

// ==============================|| NAVIGATION ||============================== //

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { layoutType, collapseMenu } = configContext.state;
  const windowSize = useWindowSize();

  // State to store filtered menu items
  const [filteredMenuItems, setFilteredMenuItems] = useState(null);

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      const menu = await getMenuItems();
      setFilteredMenuItems(menu);
    };
    fetchMenuItems();
  }, []); // Empty dependency array ensures this runs only once on mount

  const scroll = () => {
    document.querySelector('.pcoded-navbar').removeAttribute('style');
  };

  let navClass = ['pcoded-navbar', layoutType];
  navClass = [...navClass, 'menupos-fixed'];
  window.removeEventListener('scroll', scroll, false);

  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

  let navBarClass = ['navbar-wrapper'];
  let navContent = filteredMenuItems ? (
    <div className={navBarClass.join(' ')}>
      <NavContent navigation={filteredMenuItems.items} />
    </div>
  ) : (
    <div>Loading...</div> // Loading state while menu items are being fetched
  );

  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavContent navigation={filteredMenuItems ? filteredMenuItems.items : []} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
