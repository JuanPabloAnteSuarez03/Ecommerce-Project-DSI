import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { getMenuItems } from '../../../menu-items'; // Import the async function
import { BASE_TITLE } from '../../../config/constant';

const Breadcrumb = () => {
  const [main, setMain] = useState([]);
  const [item, setItem] = useState([]);
  const [menuItems, setMenuItems] = useState({ items: [] });
  const location = useLocation();

  useEffect(() => {
    // Fetch menu items when component mounts
    const fetchMenuItems = async () => {
      try {
        console.log('Fetching menu items...');
        const fetchedMenuItems = await getMenuItems();
        setMenuItems(fetchedMenuItems);
        console.log('Fetched items:', fetchedMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Process menu items after they're fetched
    if (menuItems.items.length > 0) {
      menuItems.items.forEach((item) => {
        if (item.type && item.type === 'group') {
          getCollapse(item);
        }
      });
    }
  }, [menuItems, location.pathname]);

  const getCollapse = (item) => {
    if (item.children) {
      item.children.forEach((collapse) => {
        if (collapse.type === 'collapse') {
          getCollapse(collapse);
        } else if (collapse.type && collapse.type === 'item') {
          // Adjust path matching to handle base name
          const fullPath = import.meta.env.VITE_APP_BASE_NAME 
            ? import.meta.env.VITE_APP_BASE_NAME + collapse.url 
            : collapse.url;

          if (location.pathname === fullPath) {
            setMain(item);
            setItem(collapse);
          }
        }
      });
    }
  };

  let mainContent, itemContent;
  let breadcrumbContent = '';
  let title = '';

  if (main && main.type === 'collapse') {
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{main.title}</Link>
      </ListGroup.Item>
    );
  }

  if (item && item.type === 'item') {
    title = item.title;
    itemContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{title}</Link>
      </ListGroup.Item>
    );

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">{title}</h5>
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
    }

    document.title = title + BASE_TITLE;
  }

  return <React.Fragment>{breadcrumbContent}</React.Fragment>;
};

export default Breadcrumb;