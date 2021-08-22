import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import { UploadOutlined } from "@ant-design/icons";
import reqwest from 'reqwest';
import { Row, Col, Layout, Select, Button, Upload, message, Typography } from "antd";
import dayjs from "dayjs";
import tables from "../../data/tables";
import find from "lodash/find";

var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;
const { Dragger } = Upload;
const { Text } = Typography;
const Import = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState({});
  const [selectedTableImportOption, setSelectedTableImportOption] = useState({});
  const [selectedTableImportOptions, setSelectedTableImportOptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [tableOptions, setTableOptions] = useState([]);
  const [importFiles, setImportFiles] = useState([]);
  const [importHeaders, setImportHeaders] = useState([]);


  const uploadProps = {
    onRemove: file => {
      const index = importFiles.indexOf(file);
        const newFileList = importFiles.slice();
        newFileList.splice(index, 1);
        setImportFiles(newFileList);
    },
    beforeUpload: file => {
      setImportFiles([...importFiles, file])
      return false;
    },
    importFiles,
  };

  const handleUpload = () => {
    
    const formData = new FormData();
    importFiles.forEach(file => {
      formData.append('files[]', file);
    });

    setUploading(true);

    // You can use any AJAX library you like
    reqwest({
      url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        setUploading(true);
        setImportFiles([]);
        message.success('upload successfully.');
      },
      error: () => {
        setUploading(false);
        message.error('upload failed.');
      },
    });
  };

  const populateTableImportOptions = () => {
    if(!selectedTable || !selectedTable.value) {
      return;
    }
    const table = find(tables, ['name', selectedTable.value]);
   
    const keys = Object.keys(table.header).map((k) => {
      return {label: k, value: k};
    })
    
    setSelectedTableImportOptions(keys);
  };

  const onTableSelect = (value) => {
    setSelectedTable(value);
  }

  const onSelectImportOption = (value) => {
    setSelectedTableImportOption(value);
    const table = find(tables, ['name', selectedTable.value]);
    const headers = table.header[value.value];
    setImportHeaders(headers);
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


  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if(!selectedTable) {
      return;
    }
    populateTableImportOptions();
  }, [selectedTable]);

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
              <Col>
                <h5>Table</h5>
                <Select
                  style={{
                    width: "175px",
                  }}
                  labelInValue
                  value={selectedTable}
                  disabled={!tableOptions || tableOptions.length === 0}
                  options={tableOptions}
                  onSelect={onTableSelect}
                />
              </Col>
              <Col>
                <h5>Import Options</h5>
                <Select
                  style={{
                    width: "175px",
                  }}
                  labelInValue
                  value={selectedTableImportOption}
                  disabled={
                    !selectedTable ||
                    !selectedTableImportOptions ||
                    selectedTableImportOptions.length === 0
                  }
                  onSelect={onSelectImportOption}
                  options={selectedTableImportOptions}
                />
              </Col>
              <Col>
                <h5>&nbsp;</h5>
                <Button
          type="primary"
          onClick={() => handleUpload()}
          disabled={importFiles.length === 0}
          loading={uploading}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
              </Col>
            </Row>
            <div style={{marginTop: '8px', marginBottom:'8px'}}>
              {(importHeaders &&  importHeaders.length > 0) && 
              <>
              <Row><Typography style={{fontSize: '14px'}}>Required CSV headers:</Typography></Row>
              <Row><Text code>{importHeaders.join(', ')}</Text></Row>
              </>
              }
            </div>
          </div>
          
        <Row>
        <Dragger {...uploadProps} style={{paddingLeft: 16,
            paddingRight: 16}}>
    <p className="ant-upload-drag-icon">
      <UploadOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </Dragger>
  </Row>
  <Row>
        
          </Row>
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default Import;
