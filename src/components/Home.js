import React, { useState, useEffect } from "react";
import Configurations from "./configurations/Configurations";
import logo from "../logo.svg";
import { Switch, Route, Link } from "react-router-dom";
import { Menu, Layout } from "antd";
import HeaderBar from "./HeaderBar";

import { useLocation } from "react-router-dom";
import ModelAliases from "./model-aliases/ModelAliases";
import ManufacturerAliases from "./manufacturer-aliases/ManufacturerAliases";
import Taxonomys from "./taxonomy/Taxonomys";

const { Header, Content, Sider } = Layout;

const Home = (props) => {
  const location = useLocation();
  const [siderCollapsed, setSiderCollapsed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const init = async function () {
    setIsLoading(true);

    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <React.Fragment>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={siderCollapsed}
          onCollapse={setSiderCollapsed}
        >
          <div className="logo-section">
            <img className="logo-header logo-white" src={logo} alt="logo" />
          </div>

          <div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">
                Taxonomy
                <Link to="/taxonomy" />
              </Menu.Item>
              <Menu.Item key="2">
                Configurations
                <Link to="/configurations" />
              </Menu.Item>
              <Menu.Item key="3">
                Model Aliases
                <Link to="/model-aliases" />
              </Menu.Item>
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header className="header">
            <HeaderBar title={location.pathname} />
          </Header>
          <Content
            style={{ backgroundColor: "white", height: "calc(100vh - 64px)" }}
          >
            <Switch>
            <Route path="/">
                <Taxonomys />
              </Route>
            <Route exact path="/taxonomy">
                <Taxonomys />
              </Route>
              <Route exact path="/configurations">
                <Configurations />
              </Route>
              <Route exact path="/model-aliases">
                <ModelAliases />
              </Route>
              <Route exact path="/manufacturer-aliases">
                <ManufacturerAliases />
              </Route>
              
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default Home;
