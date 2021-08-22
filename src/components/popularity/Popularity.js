import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdatePopularity from "./UpdatePopularity";
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

  const clearOptions = () => {
    setOptions([]);
  }
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
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
      onClear={clearOptions}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

const Popularity = (props) => {
  const [manufacturerId, setManufacturerId] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [modelId, setModelId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
      console.log("clearing models")
      return [{label: 'test', value:'1', key:'1'}];
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
    setSelectedModel(null);
    
    
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
    if (!option || option === null || option === '') {

      setModelId("");
      setSelectedModel(null);
    handleModelSearch("");
      return;
    }
    setIsDataLoading(true);
    setModelId(option.value);
    setSelectedModel(option);
    const res = await DataService.getPopularityForModelId(option.value);
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
      title: "Record Count",
      dataIndex: "recordCount",
      width: '120px',
      sorter: (a, b) => a.recordCount - b.recordCount,
    },
    {
      title: "Market Popularity Index",
      dataIndex: "markeyPopularityIndex",
      width: '180px',
      sorter: (a, b) => a.markeyPopularityIndex - b.markeyPopularityIndex,
    },
    {
      title: "Benchmark Group",
      dataIndex: "benchmarkGroup",
      width: '150px',
      sorter: (a, b) => a.benchmarkGroup - b.benchmarkGroup,
    },
    {
      title: "Market Popularity Label",
      dataIndex: "marketPopularityLabel",
      width: '180px',
      sorter: (a, b) => a.marketPopularityLabel - b.marketPopularityLabel,
    },
    {
      title: "Twenty",
      dataIndex: "twenty",
      width: '100px',
      sorter: (a, b) => a.twenty - b.twenty,
    },
    {
      title: "Forty",
      dataIndex: "forty",
      width: '100px',
      sorter: (a, b) => a.forty - b.forty,
    },
    {
      title: "Sixty",
      dataIndex: "sixty",
      width: '100px',
      sorter: (a, b) => a.sixty - b.sixty,
    },
    {
      title: "Eighty",
      dataIndex: "eighty",
      width: '100px',
      sorter: (a, b) => a.eighty - b.eighty,
    },
    {
      title: "Hundred",
      dataIndex: "hundred",
      width: '100px',
      sorter: (a, b) => a.hundred - b.hundred,
    },
    {
      title: "Twenty %",
      dataIndex: "twentyPercent",
      width: '100px',
      sorter: (a, b) => a.twentyPercent - b.twentyPercent,
    },
    {
      title: "Forty %",
      dataIndex: "fortyPercent",
      width: '100px',
      sorter: (a, b) => a.fortyPercent - b.fortyPercent,
    },
    {
      title: "Sixty %",
      dataIndex: "sixtyPercent",
      width: '100px',
      sorter: (a, b) => a.sixtyPercent - b.sixtyPercent,
    },
    {
      title: "Eighty %",
      dataIndex: "eightyPercent",
      width: '100px',
      sorter: (a, b) => a.eightyPercent - b.eightyPercent,
    },
    {
      title: "Hundred %",
      dataIndex: "hundredPercent",
      width: '100px',
      sorter: (a, b) => a.hundredPercent - b.hundredPercent,
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
        <Space size="middle">
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
    setIsNew(false);
    setShowUpdateDrawer(true);
  };
  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
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
          style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
            loading={isDataLoading}
            columns={columns}
            dataSource={items}
            scroll={{ x: 500, y: 400 }}
            size="small"
            rowKey="modelId"
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
        <UpdatePopularity
          popularity={item}
          isNew={isNew}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdatePopularity>
      </Drawer>
    </React.Fragment>
  );
};

export default Popularity;
