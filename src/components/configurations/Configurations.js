import React, { useState, useEffect } from "react";


import DataService from "../../services/DataService";
import UpdateConfiguration from "./UpdateConfiguration";
import { EditOutlined } from "@ant-design/icons";
import {
  Space,
  Row,
  Col,
  Input,
  Drawer,
  Layout,
  Select,
  Spin,
  Button,
  Table
} from "antd";

import { ExportTableButton } from "ant-table-extensions";

import debounce from "lodash/debounce";

import dayjs from "dayjs";
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);


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
  const [manufacturerId, setManufacturerId] = useState("");
  const [modelId, setModelId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [items, setItems] = useState([]);
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
      element.formattedDate = dayjs(element.ts).format('lll');
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
    setIsDataLoading(true);
    const res = await DataService.getConfigurationsForModelId(option.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.config_index = element.configurationId + '_' + index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: '50px',
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Configuration Id",
      dataIndex: "configurationId",
      sorter: (a, b) => a.configurationId - b.configurationId,
    },
    {
      title: "Size Class Id",
      dataIndex: "sizeClassId",
      sorter: (a, b) => a.sizeClassId - b.sizeClassId,
    },
    {
      title: "Model Id",
      dataIndex: "modelId",
      sorter: (a, b) => a.modelId - b.modelId,
    },
    {
      title: "Model Year",
      dataIndex: "modelYear",
      sorter: (a, b) => a.modelYear - b.modelYear,
    },
    {
      title: "VIN Model #",
      dataIndex: "vinModelNumber",
      sorter: (a, b) => a.vinModelNumber.localeCompare(b.vinModelNumber),
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      sorter: (a, b) => a.formattedDate - b.formattedDate,
    },
    {
      title: "Last Modified By" ,
      dataIndex: "user",
      sorter: (a, b) => a.user.localeCompare(b.user),
    },
    {
      title: "",
      key: "action",width: '50px',
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
           <Button type="link" size="small" style={{fontSize:'12px'}} icon={<EditOutlined />} onClick={() => openUpdateDrawer(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onAdd = () => {
    setConfiguration({modelId: modelId});
    setIsNew(true);
    setShowUpdateDrawer(true);
  }

  const openUpdateDrawer = (item) => {
    setConfiguration(item);
    setIsNew(false);
    setShowUpdateDrawer(true);
  };
  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
    init();
    loadData();
  };

  const loadData = async () => {
    if (modelId && modelId !== "") {
      setIsDataLoading(true);
    const res = await DataService.getConfigurationsForModelId(modelId);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.config_index = element.configurationId + '_' + index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
    }
  };


  const init = async function () {
    setIsLoading(true);
    setIsNew(false);
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
                      width: "200px",
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
                      width: "200px",
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
          <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Space>
                  <Button
                    type="ghost"
                    onClick={() => onAdd()}
                  >
                    Add
                  </Button>
                  <ExportTableButton
                    type="ghost"
                    dataSource={items}
                    columns={columns}
                    disabled={!items || items.length === 0}
                  >
                    Export
                  </ExportTableButton>
                </Space>
              </Col>
            </Row>
          </div>
          <Table
          size="small"
            columns={columns}
            dataSource={items}
            scroll={{ x: 500, y: 400 }}
            rowKey="config_index"
            style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
            loading={isDataLoading}
            pagination={{ hideOnSinglePage: true, pageSize: items? items.length: 10}}
          />
        </Content>
      </Layout>
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setShowUpdateDrawer(false)}
        visible={showUpdateDrawer}
        width={600}
      >
        <UpdateConfiguration
          configuration={configuration}
          isNew={isNew}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateConfiguration>
      </Drawer>
    </React.Fragment>
  );
};

export default Configurations;
