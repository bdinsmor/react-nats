import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdateSpec from "./UpdateSpec";
import { EditOutlined } from "@ant-design/icons";
import {
  Space,
  Row,
  Col,
  Table,
  Drawer,
  Layout,
  Spin,
  Input,
  Button,
} from "antd";
import dayjs from "dayjs";
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);
const { Content } = Layout;
const { Search } = Input;

const Specs = (props) => {
  const [configurationId, setConfigurationId] = useState('');

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});






  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: '5%',
    },
    {
      title: "Spec Family",
      dataIndex: "specFamily",
    },
    {
      title: "Spec Name Friendly",
      dataIndex: "specNameFriendly",
      width: "15%"
    },
    {
      title: "Spec Name",
      dataIndex: "specName",
    },
    {
      title: "Spec Value",
      dataIndex: "specValue"
    },
    {
      title: "Spec Uom",
      dataIndex: "specUom",
    },
    {
      title: "Spec Description",
      dataIndex: "specDescription",
      width: "20%"
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
    },
    {
      title: "Last Modified By" ,
      dataIndex: "user",
    },
    {
      title: "",
      key: "action",
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
           <Button type="link" icon={<EditOutlined />} onClick={() => openUpdateDrawer(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const openUpdateDrawer = (item) => {
    setItem(item);
    setShowUpdateDrawer(true);
  };
  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
    init();
  };

  const onLoadConfigurationId = async (value) => {
    setIsDataLoading(true);
    setConfigurationId(value);
    const res = await DataService.getSpecs(value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  };

  const init = async function () {
    setIsLoading(true);

    setIsLoading(false);
  };

  const onExport = () => {

  }

  const onAdd = () => {
    setItem({configurationId: configurationId});
    setShowUpdateDrawer(true);
  }

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
              <Col >
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
                  <Button type="ghost" onClick={onAdd} disabled={!configurationId || configurationId === ''}>Add</Button>
                  <Button type="ghost" onClick={onExport} disabled={!items || items.length === 0}>Export</Button>
                </Space>
              </Col>
            </Row>
          </div>
          <Table
          loading={isDataLoading}
            columns={columns}
            dataSource={items}
            scroll={{ x: 1500, y: 400 }}
            rowKey="id"
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
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateSpec>
      </Drawer>
    </React.Fragment>
  );
};

export default Specs;
