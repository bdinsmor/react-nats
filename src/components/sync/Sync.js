import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";

import {
  Space,
  Row,
  Col,
  Collapse,
  Layout,
  Select,
  Spin,
  Button,
  Typography,
} from "antd";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;

const { Panel } = Collapse;

const Sync = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [staged, setStaged] = useState({});

  const onToggleHistory = (item, index) => {
    const newItem = item;
    newItem.collapsed = !item.collapsed;
    history[index] = newItem;
    setHistory([...history]);
  };

  const loadHistory = async () => {
    console.log("loading history");
    const res = await DataService.getSyncHistory();
    if (res.syncHistory) {
      const hist = res.syncHistory;
      let index = 1;
      hist.forEach(function (element) {
        element.index = index;
        element.key = index;
        element.collapsed = true;
        element.formattedDate = dayjs(element.ts).format("lll");
        index++;
      });
      setHistory(hist);
    } else {
      setHistory([]);
    }
    loadStaged();
  };

  const loadStaged = async () => {
    const res = await DataService.getStagedChanges();
    res.formattedDate = dayjs(res.last_sync).format("lll");
    setStaged(res);
  };

  const onSync = async () => {
    const res = await DataService.sync();
    init();
  };

  const onSyncSandbox = async () => {
    const res = await DataService.syncSandbox();
    init();
  };

  const init = async function () {
    setIsLoading(true);
    loadHistory();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <Content
          style={{
            paddingTop: 24,
            marginTop: 8,
            marginLeft: 8,
            marginRight: 8,
            paddingLeft: 16,
            paddingRight: 16,
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Space>
                <Col>
                  <Button
                    type="primary"
                    disabled={
                      history &&
                      history.length > 0 &&
                      (history[0].action_status == "processing" ||
                        history[0].action_status == "requested")
                    }
                    onClick={onSync}
                  >
                    Sync All
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    disabled={
                      history &&
                      history.length > 0 &&
                      (history[0].action_status == "processing" ||
                        history[0].action_status == "requested")
                    }
                    onClick={onSyncSandbox}
                  >
                    Sync Sandbox Only
                  </Button>
                </Col>
              </Space>
            </Row>
            <Row gutter={16} style={{ maxWidth: "calc(100vw-250px)" }}>
              <Col>
                <Typography style={{ fontSize: "28px", fontWeight: "700" }}>
                  QA Sync History
                </Typography>
                <div style={{ maxHeight: "70vh", overflow: "auto" }}>
                  {history &&
                    history.map(function (item, index) {
                      return (
                        <div className="well">
                          <Typography
                            style={{ fontSize: "20px", fontWeight: "700" }}
                          >
                            {item.action_status}{" "}
                            <small>{item.formattedDate}</small>
                          </Typography>

                          <div>{item.user}</div>
                          <div>{item.action_id}</div>
                          <div>Sync Type: {item.action_details.sync_mode}</div>
                          <div>{item.action_result}</div>

                          {item.action_status !== "error" && (
                            <Collapse ghost className="history-changes-panel">
                              <Panel
                                showArrow={false}
                                header="Show/Hide Changes"
                                key={item.index}
                                disabled={!item.action_details.sync_changes}
                              >
                                <Row gutter={12} style={{ paddingTop: "8px" }}>
                                  <Col>
                                    <dl className="dl-horizontal">
                                      <dt>Classifications</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .classifications
                                        }
                                      </dd>
                                      <dt>Categories</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .categories
                                        }
                                      </dd>
                                      <dt>Subtypes</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .subtypes
                                        }
                                      </dd>
                                      <dt>Size Classes</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .sizeclasses
                                        }
                                      </dd>
                                      <dt>Manufacturers</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .manufacturers
                                        }
                                      </dd>
                                      <dt>Manufacturer Aliases</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .manufacturerAliases
                                        }
                                      </dd>
                                      <dt>Manufacturer VINS</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .manufacturerVins
                                        }
                                      </dd>
                                      <dt>Models</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .models
                                        }
                                      </dd>
                                      <dt>Model Aliases</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .modelAliases
                                        }
                                      </dd>
                                      <dt>Configurations</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .configurations
                                        }
                                      </dd>
                                    </dl>
                                  </Col>
                                  <Col>
                                    <dl className="dl-horizontal">
                                      <dt>Specs</dt>
                                      <dd>
                                        {item.action_details.sync_changes.specs}
                                      </dd>
                                      <dt>Values</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .values
                                        }
                                      </dd>
                                      <dt>Option Families</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .optionFamilies
                                        }
                                      </dd>
                                      <dt>Options</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .options
                                        }
                                      </dd>
                                      <dt>Region Adjustments</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .regionAdjustments
                                        }
                                      </dd>
                                      <dt>Utilization Adjustments</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .utilizationAdjustments
                                        }
                                      </dd>
                                      <dt>Condition Adjustments</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .conditionAdjustments
                                        }
                                      </dd>
                                      <dt>Usage</dt>
                                      <dd>
                                        {item.action_details.sync_changes.usage}
                                      </dd>
                                      <dt>Popularity</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .popularity
                                        }
                                      </dd>
                                      <dt>Deleted Items</dt>
                                      <dd>
                                        {
                                          item.action_details.sync_changes
                                            .deletedItems
                                        }
                                      </dd>
                                    </dl>
                                  </Col>
                                </Row>
                              </Panel>
                            </Collapse>
                          )}
                        </div>
                      );
                    })}
                </div>
              </Col>
              <Col>
                <Typography style={{ fontSize: "28px", fontWeight: "700" }}>
                  Staged Changes
                </Typography>
                {staged && staged.classifications && (
                  <>
                    <small>
                      As of last {staged.last_sync_status} sync on{" "}
                      {staged.formattedDate}
                    </small>
                    <div style={{ marginLeft: "15px" }}>
                      <Row gutter={12}>
                        <Col>
                          <dl className="dl-horizontal">
                            <dt>Classifications</dt>
                            <dd>{staged.classifications}</dd>
                            <dt>Categories</dt>
                            <dd>{staged.categories}</dd>
                            <dt>Subtypes</dt>
                            <dd>{staged.subtypes}</dd>
                            <dt>Size Classes</dt>
                            <dd>{staged.sizeclasses}</dd>
                            <dt>Manufacturers</dt>
                            <dd>{staged.manufacturers}</dd>
                            <dt>Manufacturer Aliases</dt>
                            <dd>{staged.manufacturerAliases}</dd>
                            <dt>Manufacturer VINS</dt>
                            <dd>{staged.manufacturerVins}</dd>
                            <dt>Models</dt>
                            <dd>{staged.models}</dd>
                            <dt>Model Aliases</dt>
                            <dd>{staged.modelAliases}</dd>
                            <dt>Configurations</dt>
                            <dd>{staged.configurations}</dd>
                          </dl>
                        </Col>
                        <Col className="col-xs-6">
                          <dl className="dl-horizontal">
                            <dt>Specs</dt>
                            <dd>{staged.specs}</dd>
                            <dt>Values</dt>
                            <dd>{staged.values}</dd>
                            <dt>Option Families</dt>
                            <dd>{staged.optionFamilies}</dd>
                            <dt>Options</dt>
                            <dd>{staged.options}</dd>
                            <dt>Region Adjustments</dt>
                            <dd>{staged.regionAdjustments}</dd>
                            <dt>Utilization Adjustments</dt>
                            <dd>{staged.utilizationAdjustments}</dd>
                            <dt>Condition Adjustments</dt>
                            <dd>{staged.conditionAdjustments}</dd>
                            <dt>Usage</dt>
                            <dd>{staged.usage}</dd>
                            <dt>Popularity</dt>
                            <dd>{staged.popularity}</dd>
                            <dt>Deleted Items</dt>
                            <dd>{staged.deletedItems}</dd>
                          </dl>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default Sync;
