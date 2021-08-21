import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdateOption from "./UpdateOption";
import { EditOutlined } from "@ant-design/icons";
import {
  Space,
  Row,
  Input,
  Table,
  Drawer,
  Form,
  Layout,
  Select,
  Col,
  Spin,
  Button,
} from "antd";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);
const { Content } = Layout;



const Options = (props) => {
  const [form] = Form.useForm();

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [formValues, setFormValues] = useState({});

  const searchOptions = async (formValues) => {
    setIsDataLoading(true);
    setFormValues(formValues);
    const res = await DataService.getOptions(formValues.sizeClassId, formValues.modelYear);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
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
      width: '5%',
    },
    {
      title: "Option Name",
      dataIndex: "optionName",
    },
    {
      title: "Option Value",
      dataIndex: "optionValue",
    },
    {
      title: "Option Family Id",
      dataIndex: "optionFamilyId",
    },
    {
      title: "Option Family Name",
      dataIndex: "optionFamilyName",
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

  const onExport = () => {

  }

  const onAdd = () => {
    setItem({sizeClassId: formValues.sizeClassId, modelYear: formValues.modelYear});
    setShowUpdateDrawer(true);
  }

  const openUpdateDrawer = (item) => {
    setItem(item);
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
            paddingLeft: 16,
            paddingRight: 16,
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <Row>
            <Form
        layout="inline"
        form={form}
        onFinish={searchOptions}
      >
        <Form.Item name="sizeClassId">
          <Input placeholder="Size Class Id" />
        </Form.Item>
        <Form.Item name="modelYear">
          <Input placeholder="Model Year" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Search</Button>
        </Form.Item>
      </Form>
            </Row>
            </div>
            <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Space>
                  <Button type="ghost" onClick={onAdd} disabled={!formValues || !formValues.sizeClassId || !formValues.modelYear}>Add</Button>
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
        <UpdateOption
          option={item}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateOption>
      </Drawer>
    </React.Fragment>
  );
};

export default Options;
