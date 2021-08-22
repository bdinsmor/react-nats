import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";

import {
  Space,
  Row,
  Col,

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


const Publish = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const res = await DataService.getPublishHistory();
    if (res.publishHistory) {
      const hist = res.publishHistory;
      let index = 1;
      hist.forEach(function (element) {
        element.index = index;
        element.formattedDate = dayjs(element.ts).format("lll");
        index++;
      });
      setHistory(hist);
    } else {
      setHistory([]);
    }
  
  };

  const onPublish = async () => {
    const res = await DataService.publish();
    init();
  }

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
            <Row>
            <Button type="primary"
        disabled={history && history.length>0 && (history[0].action_status=='processing' || history[0].action_status=='requested')}
        onClick={onPublish}>Publish</Button>
            </Row>
            <Typography style={{fontSize:'28px', fontWeight:'700'}}>Publish History</Typography>
            <div style={{maxHeight:'70vh', overflow:'auto'}}>
            {history &&
              history.map(function (item) {
                return (
                  <div class="well">
                    <Typography style={{fontSize:'20px', fontWeight:'700'}}>
                    {item.action_status} <small>{item.formattedDate}</small>
                      
                      </Typography>
                      
                    <div>{item.user}</div>
                    <div>{item.action_id}</div>
                    <div>{item.action_result}</div>
                  </div>
                );
              })}
              </div>
          </div>
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default Publish;
