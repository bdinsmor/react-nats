import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import { UploadOutlined } from "@ant-design/icons";
import Papa from 'papaparse';
import {
  Row,
  Col,
  Layout,
  Select,
  Button,
  Upload,
  message,
  Typography,
} from "antd";
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
  const [foundHeaders, setFoundHeaders] = useState([]);


  const uploadProps = {
    onRemove: (file) => {
      const index = importFiles.indexOf(file);
      const newFileList = importFiles.slice();
      newFileList.splice(index, 1);
      setImportFiles(newFileList);
    },
    beforeUpload: async (file) => {
      setImportFiles([...importFiles, file]);
      return false;
    },
    maxCount: 1,
    accept: 'text/csv',
    fileList: importFiles,
  };
  
  function readCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        error: err => {
          console.error("Caught error parsing CSV file:",err);
          reject(err);
          
        },
        complete: results => {
          resolve(results.meta)
        }
      });
    })
  }


  const handleUpload = async () => {
    const res = await DataService.getPresignedURL();
    const presignedUrl = res.url;
    setUploading(true);
    const uploadResponse = await DataService.uploadData(presignedUrl, {body: importFiles[0]});
    if(uploadResponse) {
      setUploading(false);
      setImportFiles([...[]]);
      setImportHeaders(null);
      setSelectedTableImportOption(null);
      setSelectedTable(null);
      message.success("Upload successfully.");
      init();
    } else {
      setUploading(false);
      message.error("Upload failed.");
    }
   
  };

  const populateTableImportOptions = () => {
    if (!selectedTable || !selectedTable.value) {
      return;
    }
    const table = find(tables, ["name", selectedTable.value]);

    const keys = Object.keys(table.header).map((k) => {
      return { label: k, value: k };
    });

    setSelectedTableImportOptions(keys);
  };

  const onTableSelect = (value) => {
    setSelectedTable(value);
  };

  const onSelectImportOption = (value) => {
    setSelectedTableImportOption(value);
    const table = find(tables, ["name", selectedTable.value]);
    const headers = table.header[value.value];
    setImportHeaders(headers);
  };

  const init = async function () {
    setIsLoading(true);
    if (tables || tables.length > 0) {
      setTableOptions(
        tables.map((t) => {
          return { value: t.name, label: t.title };
        })
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect( () => {
    
      async function fetchData() {
        try {
          const headers = await readCSV(importFiles[0]);
          if(!headers || !headers.fields || headers.fields.length === 0) {
            setFoundHeaders(null);
            return;
          }
          setFoundHeaders(headers.fields);
        
        } catch (err) {
          console.log("caught err: ",err)
          setFoundHeaders(null);
        }
      }
      if(importFiles && importFiles.length > 0) {
        fetchData();
      }    
  }, [importFiles])

  useEffect(() => {
    if (!selectedTable) {
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
              
            </Row>
            <div style={{ marginTop: "8px", marginBottom: "8px" }}>
              {importHeaders && importHeaders.length > 0 && (
                <>
                  <Row>
                    <Typography style={{ fontSize: "14px" }}>
                      Required CSV headers:
                    </Typography>
                  </Row>
                  <Row>
                    <Text code>{importHeaders.join(", ")}</Text>
                  </Row>
                </>
              )}
            </div>
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
              {importFiles && importFiles.length > 0 && foundHeaders && foundHeaders.length > 0 && (
                <>
                  <Row>
                    <Typography style={{ fontSize: "14px" }}>
                      {importFiles[0].name} has headers:
                    </Typography>
                  </Row>
                  <Row>
                    <Text code>{foundHeaders.join(", ")}</Text>
                  </Row>
                </>
              )}
            </div>

          </div>
          <Row style={{marginBottom: 24}}><Button
                  type="primary"
                  onClick={() => handleUpload()}
                  disabled={!importFiles || importFiles.length === 0 || !selectedTable || selectedTable === '' || !selectedTableImportOption || selectedTableImportOption === ''}
                  loading={uploading}
                >
                  {uploading ? "Uploading" : "Start Upload"}
                </Button></Row>
          <Row>
            <Dragger {...uploadProps} style={{ paddingLeft: 16, paddingRight: 16, minWidth: '50vw' }} >
              <p className="ant-upload-drag-icon"> <UploadOutlined /> </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              
            </Dragger>
          </Row>
         
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default Import;
