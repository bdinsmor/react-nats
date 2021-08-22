import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdateValue from "./UpdateValue";
import { EditOutlined, SearchOutlined} from "@ant-design/icons";
import {
  Space,
  Row,
  Col,
  Table,
  Input,
  Drawer,
  Layout,
  Select,
  Spin,
  Button,
} from "antd";
import Highlighter from 'react-highlight-words';
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

const Values = (props) => {
  const [manufacturerId, setManufacturerId] = useState('');
  const [modelId, setModelId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
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

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
              
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
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
    const res = await DataService.getValues(option.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  };

  const onLoadConfigurationId = async (value) => {
    setManufacturerId('');
    setModelId('');
    const res = await DataService.getValuesForConfigurationId(value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setItems(res);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: '100px',
      fixed: 'left',
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Configuration Id",
      dataIndex: "configurationId",
      width: '200px',
      sorter: (a, b) => a.configurationId - b.configurationId,
      ...getColumnSearchProps('configurationId'),
    },
    {
      title: "Model Year",
      dataIndex: "modelYear",
      width: '200px',
      sorter: (a, b) => a.modelYear - b.modelYear,
      ...getColumnSearchProps('modelYear'),
    },
    {
      title: "Revision Date",
      dataIndex: "revisionDate",
      width: '200px',
      sorter: (a, b) => a.revisionDate - b.revisionDate,
      ...getColumnSearchProps('revisionDate'),
    },
    {
      title: "MSRP",
      dataIndex: "msrp",
      width: '200px',
      sorter: (a, b) => a.msrp - b.msrp,
    },
    {
      title: "Finance",
      dataIndex: "finance",
      width: '200px',
      sorter: (a, b) => a.finance - b.finance,
    },
    {
      title: "Retail",
      dataIndex: "retail",
      width: '200px',
      sorter: (a, b) => a.retail - b.retail,
    },
    {
      title: "Whole",
      dataIndex: "wholesale",
      width: '200px',
      sorter: (a, b) => a.wholesale - b.wholesale,
    },
    {
      title: "Trade In",
      dataIndex: "tradeIn",
      width: '200px',
      sorter: (a, b) => a.tradeIn - b.tradeIn,
    },
    {
      title: "Asking Price",
      dataIndex: "askingPrice",
      width: '200px',
      sorter: (a, b) => a.askingPrice - b.askingPrice,
    },
    {
      title: "Auction Price",
      dataIndex: "auctionPrice",
      width: '200px',
      sorter: (a, b) => a.auctionPrice - b.auctionPrice,
    },
    {
      title: "Low",
      dataIndex: "low",
      width: '200px',
      sorter: (a, b) => a.low - b.low,
    },
    {
      title: "High",
      dataIndex: "high",
      width: '200px',
      sorter: (a, b) => a.high - b.high,
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: '200px',
      sorter: (a, b) => a.formattedDate - b.formattedDate,
      ...getColumnSearchProps('formattedDate'),
    },
    {
      title: "Last Modified By" ,
      dataIndex: "user",
      width: '200px',
      sorter: (a, b) => a.user - b.user,
      ...getColumnSearchProps('user'),
    },
    {
      title: "",
      key: "action",
      width: '50px',
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
          <div style={{ marginBottom: 8}}>
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
            size="small"
            loading={isDataLoading}
            style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
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
        <UpdateValue
          value={item}
          isNew={isNew}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateValue>
      </Drawer>
    </React.Fragment>
  );
};

export default Values;
