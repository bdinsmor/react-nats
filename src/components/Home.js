import React, { useState, useEffect } from "react";
import Configurations from "./configurations/Configurations";

import { Switch, Route, NavLink, Redirect, useLocation } from "react-router-dom";
import { Menu, Layout, Col, Row } from "antd";
import HeaderBar from "./HeaderBar";
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
import ResidualValuesSizes from "./values/residual-values-sizes/ResidualValuesSizes";
import ResidualValuesSubtypes from "./values/residual-values-subtypes/ResidualValuesSubtypes";
import ResidualValuesModels from "./values/residual-values-models/ResidualValuesModels";
import ConditionAdjustments from "./adjustments/condition-adjustments/ConditionAdjustments";
import RegionAdjusmtents from "./adjustments/region-adjustments/RegionAdjustments";
import UtilizationAdjustments from "./adjustments/utilization-adjustments/UtilizationAdjustments";
import WaterAdjustments from "./adjustments/water-adjustments/WaterAdjustments";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { Header, Content, Sider } = Layout;

const Home = (props) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('Taxonomy');

  const listItems = [
    {
      type: "group",
      key: "tax-group",
      children: [
        {
          key: "taxonomy",
          label: "Taxonomy",
          link: "./taxonomy",
          type: "navlink",
        },
        {
          key: "configurations",
          label: "Configurations",
          link: "./configurations",
          type: "navlink",
        },
        {
          key: "model-aliases",
          label: "Model Aliases",
          link: "./model-aliases",
          type: "navlink",
        },
        {
          key: "manufacturer-aliases",
          label: "Manufacturer Aliases",
          link: "./manufacturer-aliases",
          type: "navlink",
        },
        {
          key: "attachments",
          label: "Attachments",
          link: "./attachments",
          type: "navlink",
        },
      ],
    },
    {
      type: "group",
      key: "specs-group",
      children: [
        {
          key: "manufacturer-vins",
          label: "Manufactuerer VINs",
          link: "./manufacturer-vins",
          type: "navlink",
        },
        {
          label: "Options",
          link: "./options",
          type: "navlink",
          key: "options",
        },
        {
          label: "Specifications",
          link: "./specs",
          type: "navlink",
          key: "specs",
        },
      ],
    },
    {
      type: "group",
      key: "values-group",
      children: [
        { key: "values", label: "Values", link: "./values", type: "navlink" },
        {
          label: "Residual Values - Models",
          link: "./residual-values-models",
          type: "navlink",
          key: "residual-models",
        },
        {
          label: "Residual values - Sizes",
          link: "./residual-values-sizes",
          type: "navlink",
          key: "residual-sizes",
        },
        {
          label: "Residual Values - Subtypes",
          link: "./residual-values-subtypes",
          type: "navlink",
          key: "residual-subtypes",
        },
      ],
    },
    {
      type: "group",
      key: "adjustments-group",
      children: [
        {
          label: "Condition Adjustments",
          link: "./condition-adjustments",
          type: "navlink",
          key: "condition",
        },
        {
          label: "Region Adjustments",
          link: "./region-adjustments",
          type: "navlink",
          key: "region",
        },
        {
          label: "Utilization Adjustments",
          link: "./utilization-adjustments",
          type: "navlink",
          key: "utilization",
        },
        {
          label: "Water Adjustments",
          link: "./water-adjustments",
          type: "navlink",
          key: "water",
        },
      ],
    },
    {
      type: "group",
      key: "u-group",
      children: [
        { label: "Usage", link: "./usage", type: "navlink", key: "usage" },
        {
          label: "Popularity",
          link: "./popularity",
          type: "navlink",
          key: "popularity",
        },
      ],
    },
    {
      type: "group",
      key: 'import-group',
      children: [
        {
          label: "Import Data",
          link: "./import",
          type: "navlink",
          key: "import",
        },
        {
          label: "Export Data",
          link: "./export",
          type: "navlink",
          key: "export",
        },
        {
          label: "Export File",
          link: "./export-file",
          type: "navlink",
          key: "export-file",
        },
      ],
    },
    {
      type: "group",
      key: "sync-group",
      children: [
        { label: "QA Sync", link: "./sync", type: "navlink", key: "sync" },
        {
          label: "Publish",
          link: "./publish",
          type: "navlink",
          key: "publish",
        },
      ],
    },
  ];

  const updateCurrentPage = (pageName) => {
    setCurrentPage(pageName);
  }

  const init = async function () {
    if(location) {
      const pathName = '.' + location.pathname;
      let found = false;
      for(var i = 0; i < listItems.length; i++) {
        const kids = listItems[i].children;
        if(kids) {
          for(var j = 0; j < kids.length; j++) {
            const kid = kids[j];
            if(kid.link === pathName) {
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
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <HeaderBar title={currentPage} />
        </Header>
        <Layout>
          <Sider
          width="225px"
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
            }}
          >
            <Menu
              className="nav-menu"
              mode="inline"
              theme="dark"
              style={{
                paddingTop: "44px",
                paddingBottom: '44px'
              }}
            >
              {listItems.map(function (group) {
                return (
                  <MenuItemGroup key={group.key} title="">
                    {group.children.map(function (child) {
                      return (
                        <Menu.Item key={child.key}>
                          <NavLink
                          key={child.key}
                          onClick={() => updateCurrentPage(child.label)}
                            activeClassName="active-link"
                            to={child.link}
                          >
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
              marginLeft: 225,
              width: "100%",
              maxWidth: "80vw",
              overflow: "auto",
              marginTop: "64px",
            }}
          >
            <Content style={{ overflow: "initial" }}>
              <Switch>
                <Route exact path="/"><Redirect to="/taxonomy" />
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
                  <ResidualValuesModels />
                </Route>
                <Route exact path="/residual-values-sizes">
                  <ResidualValuesSizes />
                </Route>
                <Route exact path="/residual-values-subtypes">
                  <ResidualValuesSubtypes />
                </Route>
                <Route exact path="/condition-adjustments">
                  <ConditionAdjustments />
                </Route>
                <Route exact path="/region-adjustments">
                  <RegionAdjusmtents />
                </Route>
                <Route exact path="/utilization-adjustments">
                  <UtilizationAdjustments />
                </Route>
                <Route exact path="/water-adjustments">
                  <WaterAdjustments />
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
      </Layout>
    </React.Fragment>
  );
};

export default Home;
