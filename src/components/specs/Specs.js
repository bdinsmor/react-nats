import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdateSpec from "./UpdateSpec";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Space, Row, Col, Table, Drawer, Layout, Input, Button } from "antd";
import { ExportTableButton } from "ant-table-extensions";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;
const { Search } = Input;

const Specs = (props) => {
  const [configurationId, setConfigurationId] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
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
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
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

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      title: "Spec Family",
      dataIndex: "specFamily",
      width: "200px",
      sorter: (a, b) => a.specFamily - b.specFamily,
      ...getColumnSearchProps("specFamily"),
    },
    {
      title: "Spec Name Friendly",
      dataIndex: "specNameFriendly",
      width: "200px",
      sorter: (a, b) => a.specNameFriendly - b.specNameFriendly,
      ...getColumnSearchProps("specNameFriendly"),
    },
    {
      title: "Spec Name",
      dataIndex: "specName",
      width: "100px",
      sorter: (a, b) => a.specName - b.specName,
      ...getColumnSearchProps("specName"),
    },
    {
      title: "Spec Value",
      dataIndex: "specValue",
      width: "100px",
      sorter: (a, b) => a.specValue - b.specValue,
      ...getColumnSearchProps("specValue"),
    },
    {
      title: "Spec Uom",
      dataIndex: "specUom",
      width: "100px",
      sorter: (a, b) => a.specUom - b.specUom,
      ...getColumnSearchProps("specUom"),
    },
    {
      title: "Spec Description",
      dataIndex: "specDescription",
      width: "200px",
      sorter: (a, b) => a.specDescription - b.specDescription,
      ...getColumnSearchProps("specDescription"),
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: "200px",
      sorter: (a, b) => a.formattedDate - b.formattedDate,
      ...getColumnSearchProps("formattedDate"),
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      width: "200px",
      sorter: (a, b) => a.user - b.user,
      ...getColumnSearchProps("user"),
    },
    {
      title: "",
      key: "action",
      width: "50px",
      fixed: "right",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            style={{ fontSize: "12px" }}
            icon={<EditOutlined />}
            onClick={() => openUpdateDrawer(record)}
          >
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
    loadData();
  };

  const loadData = async () => {
    if (configurationId && configurationId !== "") {
      setItems([]);
      setIsDataLoading(true);
      const res = await DataService.getSpecs(configurationId);
      let index = 1;
      res.forEach(function (element) {
        element.index = index;
        element.formattedDate = dayjs(element.ts).format("lll");
        index++;
      });
      setItems(res);
      setIsDataLoading(false);
    }
  };

  const onLoadConfigurationId = async (value) => {
    setIsDataLoading(true);
    setConfigurationId(value);
    const res = await DataService.getSpecs(value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.formattedDate = dayjs(element.ts).format("lll");
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  };

  const init = async function () {
    setIsLoading(true);
    setIsNew(false);
    setIsLoading(false);
  };

  const onAdd = () => {
    setIsNew(true);
    setItem({ configurationId: configurationId });
    setShowUpdateDrawer(true);
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
                    disabled={!configurationId || configurationId === ""}
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
            rowKey="id"
            size="small"
            style={{ width: "100%", maxWidth: "calc(100vw - 275px)" }}
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
        <UpdateSpec
          spec={item}
          isNew={isNew}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateSpec>
      </Drawer>
    </React.Fragment>
  );
};

export default Specs;
