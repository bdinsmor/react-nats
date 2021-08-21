import React, { useState, useEffect } from "react";
import Configurations from "./configurations/Configurations";
import logo from "../logo.svg";
import { Switch, Route, Link } from "react-router-dom";
import { Menu, Layout, Divider } from "antd";
import HeaderBar from "./HeaderBar";

import { useLocation } from "react-router-dom";
import ModelAliases from "./model-aliases/ModelAliases";
import ManufacturerAliases from "./manufacturer-aliases/ManufacturerAliases";
import Taxonomys from "./taxonomy/Taxonomys";
import Attachments from "./attachments/Attachments";
import Specs from "./specs/Specs";
import Options from "./options/Options";
import Sync from "./sync/Sync";
import Export from "./export/Export";
import ExportFile from "./export-file/ExportFile";
import Import from "./import/Import";
import Publish from "./publish/Publish";
import Values from "./values/Values";
import Usage from "./usage/Usage";
import Popularity from "./popularity/Popularity";
import ManufacturerVins from "./manufacturer-vins/ManufacturerVins";

const { Header, Content, Sider } = Layout;

const Home = (props) => {
  const location = useLocation();
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const init = async function () {
   
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <React.Fragment>
      <Layout style={{ minHeight: "100vh", height: '100%' }}>
        <Sider
          collapsible
          collapsedWidth="75"
          width="250px"
          collapsed={siderCollapsed}
          onCollapse={setSiderCollapsed}
          style={{ minHeight: "100vh", overflow: 'auto', width: '250px' }}
        >
          <div className="logo-section">
            <img className="logo-header logo-white" src={logo} alt="logo" />
          </div>

          <div style={{ minHeight: "100vh", height: '100%'}}>
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
              <Menu.Item key="4">
                Manufacturer Aliases
                <Link to="/manufacturer-aliases" />
              </Menu.Item>
              <Menu.Item key="5">
                Attachments
                <Link to="/attachments" />
              </Menu.Item>
              <Divider style={{'backgroundColor':'#808080'}} />
              <Menu.Item key="6">
                Manufacturer VINs
                <Link to="/manufacturer-vins" />
              </Menu.Item>
              <Menu.Item key="7">
                Options
                <Link to="/options" />
              </Menu.Item>
              <Menu.Item key="8">
                Specifications
                <Link to="/specs" />
              </Menu.Item>
              <Divider style={{'backgroundColor':'#808080'}} />
              <Menu.Item key="9">
                Values
                <Link to="/values" />
              </Menu.Item>
              <Menu.Item key="10">
                Residual Values - Models
                <Link to="/residual-values-models" />
              </Menu.Item>
              <Menu.Item key="11">
                Residual Values - Sizes
                <Link to="/residual-values-sizes" />
              </Menu.Item>
              <Menu.Item key="12">
                Residual Values - Subtypes
                <Link to="/residual-values-subtypes" />
              </Menu.Item>
              <Divider style={{'backgroundColor':'#808080'}} />
              <Menu.Item key="13">
                Condition Adjustments
                <Link to="/condition-adjustments" />
              </Menu.Item>
              <Menu.Item key="14">
                Region Adjustments
                <Link to="/region-adjustments" />
              </Menu.Item>
              <Menu.Item key="15">
               Utilization Adjustments
                <Link to="/utlization-adjustments" />
              </Menu.Item>
              <Menu.Item key="16">
                Water Adjustments
                <Link to="/water-adjustments" />
              </Menu.Item>
              <Divider style={{'backgroundColor':'#808080'}} />
              <Menu.Item key="17">
                Usage
                <Link to="/usage" />
              </Menu.Item>
              <Menu.Item key="18">
                Popularity
                <Link to="/popularity" />
              </Menu.Item>
              <Divider style={{'backgroundColor':'#808080'}} />
              <Menu.Item key="19">
                Import Data
                <Link to="/import" />
              </Menu.Item>
              <Menu.Item key="20">
                Export Data
                <Link to="/export" />
              </Menu.Item>
              <Menu.Item key="21">
                Export File
                <Link to="/export-file" />
              </Menu.Item>
              <Divider style={{'backgroundColor':'#808080'}} />
              <Menu.Item key="22">
                QA Sync
                <Link to="/sync" />
              </Menu.Item>
              <Menu.Item key="23">
                Publish
                <Link to="/publish" />
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
            <Route exact path="/">
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
              <Route exact path="/manufacturer-vins">
                <ManufacturerVins />
              </Route>
              <Route exact path="/attachments">
                <Attachments />
              </Route>
              <Route exact path="/options">
                <Options />
              </Route>
              <Route exact path="/specs">
                <Specs />
              </Route>
              <Route exact path="/values">
                <Values />
              </Route>
              <Route exact path="/residual-values-models">
                <Residual-Values-Models />
              </Route>
              <Route exact path="/residual-values-sizes">
                <Residual-Values-Sizes />
              </Route>
              <Route exact path="/residual-values-subtypes">
                <Residual-Values-Subtypes />
              </Route>
              <Route exact path="/condition-adjustments">
                <Condition-Adjustments />
              </Route>
              <Route exact path="/region-adjustments">
                <Region-Adjustments />
              </Route>
              <Route exact path="/utilization-adjustments">
                <Utilization-Adjustments />
              </Route>
              <Route exact path="/water-adjustments">
                <Water-Adjustments />
              </Route>
              <Route exact path="/usage">
                <Usage />
              </Route>
              <Route exact path="/popularity">
                <Popularity />
              </Route>
              <Route exact path="/import">
                <Import />
              </Route>
              <Route exact path="/export">
                <Export />
              </Route>
              <Route exact path="/export-file">
                <ExportFile />
              </Route>
              <Route exact path="/sync">
                <Sync />
              </Route>
              <Route exact path="/publish">
                <Publish />
              </Route>
              
              
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default Home;
