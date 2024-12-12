import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { BASE_TITLE } from '../../../config/constant';

const Breadcrumb = ({ menuItems }) => {
  const [main, setMain] = useState(null);
  const [item, setItem] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Process menu items after they are passed in
    if (menuItems && menuItems.items.length > 0) {
      menuItems.items.forEach((group) => {
        if (group.type === 'group' && group.children) {
          processGroup(group);
        }
      });
    }
  }, [menuItems, location.pathname]);

  const processGroup = (group) => {
    group.children.forEach((child) => {
      if (child.type === 'collapse' && child.children) {
        processGroup(child);
      } else if (child.type === 'item') {
        const fullPath = import.meta.env.VITE_APP_BASE_NAME
          ? import.meta.env.VITE_APP_BASE_NAME + child.url
          : child.url;

        if (location.pathname === fullPath) {
          setMain(group);
          setItem(child);
        }
      }
    });
  };

  const renderBreadcrumbContent = () => {
    if (!item || item.breadcrumbs === false) return null;

    const mainContent = main && main.type === 'collapse' && (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{main.title}</Link>
      </ListGroup.Item>
    );

    const itemContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{item.title}</Link>
      </ListGroup.Item>
    );

    return (
      <div className="page-header">
        <div className="page-block">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="page-header-title">
                <h5 className="m-b-10">{item.title}</h5>
              </div>
              <ListGroup as="ul" bsPrefix=" " className="breadcrumb">
                <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                  <Link to="/">
                    <i className="feather icon-home" />
                  </Link>
                </ListGroup.Item>
                {mainContent}
                {itemContent}
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (item) {
      document.title = item.title + BASE_TITLE;
    }
  }, [item]);

  return <React.Fragment>{renderBreadcrumbContent()}</React.Fragment>;
};

export default Breadcrumb;
