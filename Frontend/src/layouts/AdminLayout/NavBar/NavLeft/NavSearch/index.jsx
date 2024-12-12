import React from 'react';
import { Link } from 'react-router-dom';

// ==============================|| NAV SEARCH ||============================== //

const NavSearch = () => {
  return (
    <React.Fragment>
      <Link to="#" className="pop-search">
        <i className="feather icon-search" />
      </Link>
    </React.Fragment>
  );
};

export default NavSearch;
