import React, { useState, useEffect } from "react";
import DataService from "../../../services/DataService";
import { Space, Row, Col, Table, Layout, Select, Spin } from "antd";
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

const ResidualValuesModels = (props) => {
  const [manufacturerId, setManufacturerId] = useState("");
  const [modelId, setModelId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
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
    setModelId(option.value);
    setSelectedModel(option);
    setIsDataLoading(true);
    const res = await DataService.getAliasesForModelId(option.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.model_index = element.modelId + '_' + index;
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
      width: "100px",
      sorter: (a, b) => a.modelId - b.modelId,
    },
    {
      title: "Size Class Id",
      dataIndex: "sizeClassId",
      width: "150px",
      sorter: (a, b) => a.sizeClassId - b.sizeClassId,
    },
    {
      title: "1",
      dataIndex: "1",
      width: '100px',
      sorter: (a, b) => a['1'] - b['1'],
    },
    {
      title: "2",
      dataIndex: "2",
      width: '100px',
      sorter: (a, b) => a['2'] - b['2'],
    },
    {
      title: "3",
      dataIndex: "3",
      width: '100px',
      sorter: (a, b) => a['3'] - b['3'],
    },
    {
      title: "4",
      dataIndex: "4",
      width: '100px',
      sorter: (a, b) => a['4'] - b['4'],
    },
    {
      title: "5",
      dataIndex: "5",
      width: '100px',
      sorter: (a, b) => a['5'] - b['5'],
    },
    {
      title: "6",
      dataIndex: "6",
      width: '100px',
      sorter: (a, b) => a['6'] - b['6'],
    },
    {
      title: "7",
      dataIndex: "7",
      width: '100px',
      sorter: (a, b) => a['7'] - b['7'],
    },
    {
      title: "8",
      dataIndex: "8",
      width: '100px',
      sorter: (a, b) => a['8'] - b['8'],
    },
    {
      title: "9",
      dataIndex: "9",
      width: '100px',
      sorter: (a, b) => a['9'] - b['9'],
    },
    {
      title: "10",
      dataIndex: "10",
      width: '100px',
      sorter: (a, b) => a['10'] - b['10'],
    },
    {
      title: "11",
      dataIndex: "11",
      width: '100px',
      sorter: (a, b) => a['11'] - b['11'],
    },
    {
      title: "12",
      dataIndex: "12",
      width: '100px',
      sorter: (a, b) => a['12'] - b['12'],
    },
    {
      title: "13",
      dataIndex: "13",
      width: '100px',
      sorter: (a, b) => a['13'] - b['13'],
    },
    {
      title: "14",
      dataIndex: "14",
      width: '100px',
      sorter: (a, b) => a['14'] - b['14'],
    },
    {
      title: "15",
      dataIndex: "15",
      width: '100px',
      sorter: (a, b) => a['15'] - b['15'],
    },
    {
      title: "16",
      dataIndex: "16",
      width: '100px',
      sorter: (a, b) => a['16'] - b['16'],
    },
    {
      title: "17",
      dataIndex: "17",
      width: '100px',
      sorter: (a, b) => a['17'] - b['17'],
    },
    {
      title: "18",
      dataIndex: "18",
      width: '100px',
      sorter: (a, b) => a['18'] - b['18'],
    },
    {
      title: "19",
      dataIndex: "19",
      width: '100px',
      sorter: (a, b) => a['19'] - b['19'],
    },
    {
      title: "20",
      dataIndex: "20",
      width: '100px',
      sorter: (a, b) => a['20'] - b['20'],
    },
    {
      title: "21",
      dataIndex: "21",
      width: '100px',
      sorter: (a, b) => a['21'] - b['21'],
    },
    {
      title: "22",
      dataIndex: "22",
      width: '100px',
      sorter: (a, b) => a['22'] - b['22'],
    },
    {
      title: "23",
      dataIndex: "23",
      width: '100px',
      sorter: (a, b) => a['23'] - b['23'],
    },
    {
      title: "24",
      dataIndex: "24",
      width: '100px',
      sorter: (a, b) => a['24'] - b['24'],
    },
    {
      title: "25",
      dataIndex: "25",
      width: '100px',
      sorter: (a, b) => a['25'] - b['25'],
    },
    {
      title: "26",
      dataIndex: "26",
      width: '100px',
      sorter: (a, b) => a['26'] - b['26'],
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: '200px',
      sorter: (a, b) => a.formattedDate - b.formattedDate,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      width: '200px',
      sorter: (a, b) => a.user.localeCompare(b.user),
    },
  ];

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
              </Space>
            </Row>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Space>
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
            columns={columns}
            dataSource={items}
            scroll={{ x: 500, y: 400 }}
            rowKey="model_index"
            style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
            size="small"
            loading={isDataLoading}
            pagination={{
              hideOnSinglePage: true,
              pageSize: items ? items.length : 10,
            }}
          />
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default ResidualValuesModels;
