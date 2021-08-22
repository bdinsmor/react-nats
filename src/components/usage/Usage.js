import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdateUsage from "./UpdateUsage";
import { EditOutlined } from "@ant-design/icons";
import {
  Space,
  Row,
  Col,
  Table,
  Drawer,
  Layout,
  Select,
  Spin,
  Button,
} from "antd";
import { ExportTableButton } from "ant-table-extensions";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;

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

const Usage = (props) => {
  const [manufacturerId, setManufacturerId] = useState("");

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [modelId, setModelId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = React.useState(false);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
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
    setIsDataLoading(true);
    setModelId(option.value);
    setSelectedModel(option);
    const res = await DataService.getUsageForModelId(option.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.formattedDate = dayjs(element.ts).format("lll");
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: "50px",
      fixed: "left",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Model Id",
      dataIndex: "modelId",
      width: '100px',
      sorter: (a, b) => a.modelId - b.modelId,
    },
    {
      title: "Model Year",
      dataIndex: "modelYear",
      width: '100px',
      sorter: (a, b) => a.modelYear - b.modelYear,
    },
    {
      title: "Age",
      dataIndex: "age",
      width: '100px',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Benchmark Level",
      dataIndex: "benchmarkLevel",
      width: '150px',
      sorter: (a, b) => a.benchmarkLevel - b.benchmarkLevel,
    },
    {
      title: "Mean Annual Usage",
      dataIndex: "meanAnnualUsage",
      width: '150px',
      sorter: (a, b) => a.meanAnnualUsage - b.meanAnnualUsage,
    },
    {
      title: "Record Count",
      dataIndex: "recordCount",
      width: '150px',
      sorter: (a, b) => a.recordCount - b.recordCount,
    },
    {
      title: "Percentile25",
      dataIndex: "percentile25",
      width: '100px',
      sorter: (a, b) => a.percentile25 - b.percentile25,
    },
    {
      title: "Percentile45",
      dataIndex: "percentile45",
      width: '100px',
      sorter: (a, b) => a.percentile45 - b.percentile45,
    },
    {
      title: "Percentile55",
      dataIndex: "percentile55",
      width: '100px',
      sorter: (a, b) => a.percentile55 - b.percentile55,
    },
    {
      title: "Percentile75",
      dataIndex: "percentile75",
      width: '100px',
      sorter: (a, b) => a.percentile75 - b.percentile75,
    },
    {
      title: "Distribution25",
      dataIndex: "distribution25",
      width: '120px',
      sorter: (a, b) => a.distribution25 - b.distribution25,
    },
    {
      title: "Distribution45",
      dataIndex: "distribution45",
      width: '120px',
      sorter: (a, b) => a.distribution45 - b.distribution45,
    },
    {
      title: "Distribution55",
      dataIndex: "distribution55",
      width: '120px',
      sorter: (a, b) => a.distribution55 - b.distribution55,
    },
    {
      title: "Distribution75",
      dataIndex: "distribution75",
      width: '120px',
      sorter: (a, b) => a.distribution75 - b.distribution75,
    },
    {
      title: "Distribution99",
      dataIndex: "distribution99",
      width: '120px',
      sorter: (a, b) => a.distribution99 - b.distribution99,
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: '150px',
      sorter: (a, b) => a.formattedDate - b.formattedDate,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      width: '150px',
      sorter: (a, b) => a.user - b.user,
    },
    {
      title: "",
      key: "action",
      width: '50px',
      fixed: "right",
      render: (text, record) => (
        <Space size="left">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openUpdateDrawer(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];


  const onAdd = () => {
    setItem({ modelId: modelId });
    setIsNew(true);
    setShowUpdateDrawer(true);
  };

  const openUpdateDrawer = (item) => {
    setItem(item);
    setShowUpdateDrawer(true);
  };
  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
    setIsNew(false);
    
    init();
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
              </Space>
            </Row>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Space>
                  <Button
                    type="ghost"
                    onClick={onAdd}
                    disabled={!modelId || modelId === ""}
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
            loading={isDataLoading}
            columns={columns}
            dataSource={items}
            scroll={{ x: 500, y: 400 }}
            size="small"
            style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
            rowKey="modelId"
            pagination={{
              hideOnSinglePage: true,
              pageSize: items ? items.length : 10,
            }}
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
        <UpdateUsage
          usage={item}
          isNew={isNew}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateUsage>
      </Drawer>
    </React.Fragment>
  );
};

export default Usage;
