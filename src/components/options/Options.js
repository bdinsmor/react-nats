import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdateOption from "./UpdateOption";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Space,
  Row,
  Input,
  Table,
  Drawer,
  Form,
  Layout,
  Col,
  Button,
} from "antd";
import Highlighter from 'react-highlight-words';
import { ExportTableButton } from "ant-table-extensions";
import dayjs from "dayjs";
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);
const { Content } = Layout;



const Options = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [formValues, setFormValues] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

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

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: '50px',
      fixed: 'left',
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Option Name",
      dataIndex: "optionName",
      width: '100px',
      sorter: (a, b) => a.optionName - b.optionName,
      ...getColumnSearchProps('optionName'),
    },
    {
      title: "Option Value",
      dataIndex: "optionValue",
      width: '100px',
      sorter: (a, b) => a.optionValue - b.optionValue,
      ...getColumnSearchProps('optionValue'),
    },
    {
      title: "Option Family Id",
      dataIndex: "optionFamilyId",
      width: '120px',
      sorter: (a, b) => a.optionFamilyId - b.optionFamilyId,
      ...getColumnSearchProps('optionFamilyId'),
    },
    {
      title: "Option Family Name",
      dataIndex: "optionFamilyName",
      width: '150px',
      sorter: (a, b) => a.optionFamilyName - b.optionFamilyName,
      ...getColumnSearchProps('optionFamilyName'),
    },
    
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: '120px',
      sorter: (a, b) => a.formattedDate - b.formattedDate,
      ...getColumnSearchProps('formattedDate'),
    },
    {
      title: "Last Modified By" ,
      dataIndex: "user",
      width: '120px',
      sorter: (a, b) => a.user - b.user,
      ...getColumnSearchProps('user'),
    },
    {
      title: "",
      key: "action",width: '50px',
      fixed: 'right',
      
      render: (text, record) => (
        <Space size="small" >
           <Button type="link" size="small" style={{fontSize:'12px'}} icon={<EditOutlined />} onClick={() => openUpdateDrawer(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onAdd = () => {
    setIsNew(true);
    setItem({sizeClassId: formValues.sizeClassId, modelYear: formValues.modelYear});
    setShowUpdateDrawer(true);
  }

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
            <Form
        layout="inline"
        form={form}
        onFinish={searchOptions}
      >
        <Col>
        <h5>Size Class Id</h5>
        <Form.Item name="sizeClassId">
          <Input placeholder="Size Class Id" />
        </Form.Item>
        </Col>
        <Col>
        <h5>Model Year</h5>
        <Form.Item name="modelYear">
          <Input placeholder="Model Year" />
        </Form.Item>
        
        </Col>
        <Col>
        <h5>&nbsp;</h5>
        <Form.Item>
          <Button htmlType="submit">Search</Button>
        </Form.Item>
        </Col>
      </Form>
            </Row>
            </div>
            <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Space>
                  <Button type="ghost" onClick={() => onAdd()} disabled={!formValues || !formValues.sizeClassId || !formValues.modelYear}>Add</Button>
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
            style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
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
        <UpdateOption
          option={item}
          isNew={isNew}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateOption>
      </Drawer>
    </React.Fragment>
  );
};

export default Options;
