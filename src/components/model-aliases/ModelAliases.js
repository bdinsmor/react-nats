import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import CreateModelAlias from "../CreateModelAlias";
import UpdateModelAlias from "./UpdateModelAlias";
import {
  AutoComplete,
  Space,
  Row,
  Col,
  Input,
  Table,
  Drawer,
  Layout,
  Button,
} from "antd";

const { Content } = Layout;
const { Option } = AutoComplete;
const { Search } = Input;
const ModelAliases = (props) => {
  const [manufacturerId, setManufacturerId] = useState([]);
  const [modelId, setModelId] = useState([]);
  const [model, setModel] = useState([]);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [manufacturerResults, setManufacturerResults] = useState([]);
  const [modelResults, setModelResults] = useState([]);
  
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  
  const handleManufacturerSearch = async (value) => {
    const res = await DataService.getManufacturers(value);
    setManufacturerResults(res);
  };

  const handleModelSearch = async (value) => {
    const res = await DataService.getModelsForManufacturer(
      manufacturerId,
      value
    );
    setModelResults(res);
  };

  const onManufacturerSelect = (val, option) => {
    setManufacturerId(option.value);
  };

  const onModelSelect = async (val, option) => {
    setModelId(option.value);
    const res = await DataService.getModelAliasesForModelId(option.value);
    setModels(res);
  };

  const onUpdateModelAlias = (record) => {
    return;
  };

  const columns = [
    {
      title: "Model Id",
      dataIndex: "modelId",
      editable: true,
    },
    {
      title: "Alias",
      dataIndex: "alias",
      editable: true,
    },
    
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => openUpdateDrawer(record)}>Edit</Button>
         
        </Space>
      ),
    },
  ];

  const openCreateDrawer = () => {
    setShowCreateDrawer(true);
  };
  const onCreateSuccess = () => {
    setShowCreateDrawer(false);
    init();
  };
  const openUpdateDrawer = (item) => {
    setModel(item);
    setShowUpdateDrawer(true);
  };
  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
    init();
  };

  const init = async function () {
    setIsLoading(true);

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
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        >
         
          <div style={{ marginBottom: 8, paddingLeft: 16 }}>
            <Row>
              <Space>
                <Col>
                  <h5>Manufacturer</h5>
                  <AutoComplete
                    style={{ width: 200 }}
                    onSearch={handleManufacturerSearch}
                    onSelect={(val, option) =>
                      onManufacturerSelect(val, option)
                    }
                    placeholder="Manufacturer"
                  >
                    {manufacturerResults &&
                      manufacturerResults.length > 0 &&
                      manufacturerResults.map((manufacturer) => (
                        <Option
                          key={manufacturer.manufacturerId}
                          value={manufacturer.manufacturerId}
                        >
                          {manufacturer.manufacturerName}
                        </Option>
                      ))}
                  </AutoComplete>
                </Col>
                <Col>
                  <h5>Model</h5>
                  <AutoComplete
                    style={{ width: 200 }}
                    onSearch={handleModelSearch}
                    onSelect={(val, option) => onModelSelect(val, option)}
                    placeholder="Model"
                  >
                    {modelResults &&
                      modelResults.length > 0 &&
                      modelResults.map((model) => (
                        <Option key={model.modelId} value={model.modelId}>
                          {model.modelName}
                        </Option>
                      ))}
                  </AutoComplete>
                </Col>
              </Space>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}></div>
          <Table
            columns={columns}
            dataSource={models}
            rowKey="modelId"
          />
        </Content>
      </Layout>
      <Drawer
                placement="right"
                closable={false}
                onClose={() => setShowCreateDrawer(false)}
                visible={showCreateDrawer}
                width={600}
            >
                <CreateModelAlias onSaveSuccess={onCreateSuccess} onCancel={() => setShowCreateDrawer(false)}></CreateModelAlias>
            </Drawer>
            <Drawer
                placement="right"
                closable={false}
                onClose={() => setShowUpdateDrawer(false)}
                visible={showUpdateDrawer}
                width={600}
            >
                <UpdateModelAlias model={model} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdateModelAlias>
            </Drawer>
    </React.Fragment>
  );
};

export default ModelAliases;
