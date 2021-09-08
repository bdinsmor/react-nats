/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { OrderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Switch, Route, NavLink, Redirect, useLocation } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import HeaderBar from './HeaderBar';
import Lineups from './lineups/Lineups';
import Players from './players/Players';
const MenuItemGroup = Menu.ItemGroup;

const { Header, Content, Sider } = Layout;

const Home = (props) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('Lineups');

  const listItems = [
    {
      type: 'group',
      key: 'revs-group',
      children: [
        {
          key: 'lineups',
          label: 'Lineups',
          link: './lineups',
          type: 'navlink',
          icon: <OrderedListOutlined />,
        },
        {
          key: 'players',
          label: 'Roster',
          link: './players',
          type: 'navlink',
          icon: <UserOutlined />,
        },
      ],
    },
  ];

  const onToggleChange = () => {
    setIsCollapsed(!isCollapsed);
  };

  const updateCurrentPage = (pageName) => {
    setCurrentPage(pageName);
  };

  const init = async function () {
    if (location) {
      const pathName = '.' + location.pathname;
      let found = false;
      for (var i = 0; i < listItems.length; i++) {
        const kids = listItems[i].children;
        if (kids) {
          for (var j = 0; j < kids.length; j++) {
            const kid = kids[j];
            if (kid.link === pathName) {
              console.log('setting page to: ' + kid.label);
              setCurrentPage(kid.label);
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <HeaderBar title={currentPage} />
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={isCollapsed}
            onCollapse={() => {
              onToggleChange();
            }}
            style={{
              marginTop: '40px',
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <Menu
              className="nav-menu"
              mode="inline"
              theme="dark"
              style={{
                paddingTop: '64px',
                paddingBottom: '44px',
              }}
            >
              {listItems.map(function (group) {
                return (
                  <MenuItemGroup key={group.key} title="">
                    {group.children.map(function (child, childIter) {
                      return (
                        <Menu.Item key={child.key} icon={child.icon} title={null}>
                          <NavLink key={child.key} onClick={() => updateCurrentPage(child.label)} activeClassName="active-link" to={child.link}>
                            {child.label}
                          </NavLink>
                        </Menu.Item>
                      );
                    })}
                  </MenuItemGroup>
                );
              })}
            </Menu>
          </Sider>
          <Layout
            className="site-layout"
            style={{
              width: '100%',
              overflow: 'auto',
              marginTop: '64px',
              marginLeft: isCollapsed ? '75px' : '225px',
              maxWidth: isCollapsed ? '95vw' : '80vw',
            }}
          >
            <Content style={{ overflow: 'initial' }}>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/players" />
                </Route>
                <Route exact path="/lineups">
                  <Lineups />
                </Route>
                <Route exact path="/players">
                  <Players />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default Home;
