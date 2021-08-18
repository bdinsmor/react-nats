import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import CreateConfiguration from "./CreateConfiguration";
import UpdateConfiguration from "./UpdateConfiguration";
import {
  Space,
  Row,
  Col,
  Input,
  Table,
  Drawer,
  Layout,
  Select,
  Spin,
  Button,
} from "antd";
import debounce from "lodash/debounce";

const { Content } = Layout;
const { Search } = Input;

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      showSearch
      showArrow={false}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

const Configurations = (props) => {
  const [manufacturerId, setManufacturerId] = useState([]);
  const [modelId, setModelId] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [manufacturerResults, setManufacturerResults] = useState([]);
  const [modelResults, setModelResults] = useState([]);
  const [items, setItems] = useState([]);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [configuration, setConfiguration] = useState({});
  const [selectedManufacturer, setSelectedManufacturer] = useState([]);
  const [selectedModel, setSelectedModel] = useState([]);
  const handleManufacturerSearch = async (value) => {
    const res = await DataService.getManufacturers(value);
    const manuResults = res.map((item) => ({
      label: `${item.manufacturerName}`,
      value: item.manufacturerId,
    }));
    return manuResults;
  };

  const handleModelSearch = async (value) => {
    if (!value || value === "") {
      return [];
    }
    const res = await DataService.getModelsForManufacturer(
      manufacturerId,
      value
    );
    const modelResults = res.map((item) => ({
      label: `${item.modelName}`,
      value: item.modelId,
    }));
    return modelResults;
  };

  const onLoadConfigurationId = async (value) => {
    const res = await DataService.getConfigurationById(value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setItems(res);
  };

  const onManufacturerSelect = (option) => {
    setSelectedModel(null);
    handleModelSearch("");
    setItems([]);
    if (!option || option === null) {
      setSelectedManufacturer(null);
      setManufacturerId(null);

      return;
    }
    setSelectedManufacturer(option);
    setManufacturerId(option.value);
  };

  const onModelSelect = async (option) => {
    if (!option || option === null) {
      setModelId("");
      setSelectedModel(null);
      return;
    }
    setModelId(option.value);
    setSelectedModel(option);
    const res = await DataService.getConfigurationsForModelId(option.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setItems(res);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: '5%',
    },
    {
      title: "Configuration Id",
      dataIndex: "configurationId",
      editable: true,
    },
    {
      title: "Size Class Id",
      dataIndex: "sizeClassId",
      editable: true,
    },
    {
      title: "Model Id",
      dataIndex: "modelId",
      editable: true,
    },
    {
      title: "Model Year",
      dataIndex: "modelYear",

      editable: true,
    },
    {
      title: "VIN Model #",
      dataIndex: "vinModelNumber",
      editable: true,
    },
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By" ,
      dataIndex: "user",
      editable: true,
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => openUpdateDrawer(record)}>
            Edit
          </Button>
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
    setConfiguration(item);
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
                  <DebounceSelect
                    placeholder="Search Manufacturers"
                    value={selectedManufacturer}
                    fetchOptions={handleManufacturerSearch}
                    allowClear={true}
                    onChange={onManufacturerSelect}
                    style={{
                      width: "300px",
                    }}
                  />
                </Col>
                <Col>
                  <h5>Model</h5>
                  <DebounceSelect
                    placeholder="Search Models"
                    value={selectedModel}
                    fetchOptions={handleModelSearch}
                    onChange={onModelSelect}
                    allowClear={true}
                    style={{
                      width: "300px",
                    }}
                  />
                </Col>

                <Col span={12} offset={12}>
                  <h5>Configuration Id</h5>
                  <Search
                    placeholder="Configuration Id"
                    onSearch={onLoadConfigurationId}
                    style={{ width: 200 }}
                  />
                </Col>
              </Space>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}></div>
          <Table
            columns={columns}
            dataSource={items}
            rowKey="configurationId"
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
        <CreateConfiguration
          onSaveSuccess={onCreateSuccess}
          onCancel={() => setShowCreateDrawer(false)}
        ></CreateConfiguration>
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setShowUpdateDrawer(false)}
        visible={showUpdateDrawer}
        width={600}
      >
        <UpdateConfiguration
          configuration={configuration}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateConfiguration>
      </Drawer>
    </React.Fragment>
  );
};

export default Configurations;
