import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import { notification, Row, Col, Layout, Space, Select, Button } from "antd";
import dayjs from "dayjs";

import tables from "../../data/tables-for-export";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;

const ExportFile = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState({});
  const [tableOptions, setTableOptions] = useState([]);


  const openExportNotification = () => {
    notification.open({
      message: 'File Export Request Submitted',
      description:
        'Export File request has been submitted. You will receive an email shortly with a progress update',
      className: 'export-message-class',
      duration: 10,
      style: {
        width: 600,
      },
    });
  };

  const onTableSelect = (value) => {
    setSelectedTable(value);
    
  }

  const init = async function () {
    setIsLoading(true);
    if(tables || tables.length > 0) {
      setTableOptions(tables.map((t) => {
        return {value: t.name, label: t.title};
      }));
    }
    
    setIsLoading(false);
  };

  const onExport = async() => {
    const postData = {
      fileName: selectedTable.value,
    };
    const res = await DataService.exportFlatFile(postData);
    openExportNotification();
  }


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
            <Row gutter={12}  style={{marginBottom:'24px'}}>
              <Col>
                <h5>Flat File</h5>
                <Select
                  style={{
                    width: "250px",
                  }}
                  labelInValue
                  value={selectedTable}
                  disabled={!tableOptions || tableOptions.length === 0}
                  options={tableOptions}
                  onSelect={onTableSelect}
                />
              </Col>
            </Row>
           
            <Row  style={{marginBottom: '24px'}}>
            <Button type="primary"onClick={onExport}>Export</Button>
            </Row>

        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default ExportFile;
