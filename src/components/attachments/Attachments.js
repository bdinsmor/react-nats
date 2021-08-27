import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import {
  Space,
  Row,
  Col,
  Drawer,
  Layout,
  Select,
  Button,
  Table
} from "antd";
import { ExportTableButton } from "ant-table-extensions";

import { EditOutlined } from "@ant-design/icons";
import UpdateAttachment from "./UpdateAttachment";
import dayjs from "dayjs";
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);

const { Content } = Layout;

const Attachments = (props) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [classifications, setClassifications] = useState([]);
  const [classificationId, setClassificationId] = useState("");
  const [selectedClassification, setSelectedClassification] = useState({});

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});

  const [subtypes, setSubtypes] = useState([]);
  const [subtypeId, setSubtypeId] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState({});

  const [items, setItems] = useState([]);
  const [rowKey, setRowKey] = useState("");
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [attachment, setAttachment] = useState({});

  

  const resetChoices = () => {
    setSelectedCategory({});
    setSelectedClassification({});
    setSelectedSubtype({});
    setCategories([]);
    setSubtypes([]);
  };

  const populateClassifications = async () => {
    resetChoices();
    const res = await DataService.getClassifications();
    const options = res.map((item) => ({
      label: `${item.classificationName}`,
      value: item.classificationId,
      key: item.classificationId,
    }));
    setClassifications(options);
   
    setIsDataLoading(false);
  };

  const onSelectClassification = (value) => {
    setClassificationId(value.value);
    setSelectedClassification(value);
  };

  const populateCategories = async () => {
    if (!classificationId || classificationId === "") {
      return;
    }
    setCategories([]);
    const res = await DataService.getCategories(classificationId);
    const options = res.map((item) => ({
      label: `${item.categoryName}`,
      value: item.categoryId,
      key: item.categoryId,
    }));
    setCategories(options);
    
    setIsDataLoading(false);
  };

  const onSelectCategory = (value) => {
    setCategoryId(value.value);
    setSelectedCategory(value);
  };

  const populateSubtypes = async () => {
    if (!classificationId || classificationId === "") {
      return;
    }
    if (!categoryId || categoryId === "") {
      return;
    }
    const res = await DataService.getSubtypes(classificationId, categoryId);
    const options = res.map((item) => ({
      label: `${item.subtypeName}`,
      value: item.subtypeId,
      key: item.subtypeId,
    }));
    setSubtypes(options);
    setIsDataLoading(false);
  };

  const onSelectSubtype = (value) => {
    setSubtypeId(value.value);
    setSelectedSubtype(value);
  };

  const loadAttachments = async () => {
    const res = await DataService.getAttachments(subtypeId);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  }

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: "50px",
      fixed:'left',
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,

    },
    {
      title: "Subtype Id",
      dataIndex: "subtypeId",
      width: "100px",
      sorter: (a, b) => a.subtypeId - b.subtypeId,
    },
    {
      title: "Subtype Name",
      dataIndex: "subtypeName",
      width: "120px",
      sorter: (a, b) => a.subtypeName.localeCompare(b.subtypeName),
    },
    {
      title: "Attachment Category Id",
      dataIndex: "attachmentCategoryId",
      width: "170px",
      sorter: (a, b) => a.attachmentCategoryId - b.attachmentCategoryId,
    },
    {
      title: "Attachment Category Name",
      dataIndex: "categoryName",
      width: "180px",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: "150px",
      sorter: (a, b) => a.formattedDate - b.formattedDate,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      width: "150px",
      sorter: (a, b) => a.user.localeCompare(b.user),
    },
    {
      title: "",
      key: "action",
      width: '50px',
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small" style={{fontSize:'12px'}} icon={<EditOutlined />}
            onClick={() => openUpdateDrawer(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onAdd = () => {
    setAttachment({subtypeId: subtypeId});
    setShowUpdateDrawer(true);
  }

  const openUpdateDrawer = (item) => {
    setAttachment(item);
    setShowUpdateDrawer(true);
  };
  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
    init();
  };

  const init = async function () {
    setIsDataLoading(true);
    populateClassifications();
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    clearRows();
    setSelectedCategory({});
    setSubtypeId("");
    setSubtypes([]);
    setSelectedSubtype({});
    if (!classificationId || classificationId === "") {
      return;
    }
    populateCategories();
  }, [classificationId]);

  useEffect(() => {
    clearRows();
    setSubtypeId("");
    setSelectedSubtype({});
    setSubtypes([]);
    if (!categoryId || categoryId === "") {
      return;
    }
    populateSubtypes();
  }, [categoryId]);

  useEffect(() => {
    clearRows();
    if (!subtypeId || subtypeId === "") {
      return;
    }
    loadAttachments();
  }, [subtypeId]);


  const clearRows = () => {
    setIsDataLoading(true);
    setItems([]);
  };

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
            <Row gutter={12}>
              <Space>
                <Col>
                  <h5>Classification</h5>
                  <Select
                    style={{
                      width: "175px",
                    }}
                    placeholder="Classification"
                    labelInValue
                    value={selectedClassification}
                    onSelect={onSelectClassification}
                    disabled={!classifications || classifications.length === 0}
                    options={classifications}
                  />
                </Col>
                <Col>
                  <h5>Category</h5>
                  <Select
                    style={{
                      width: "175px",
                    }}
                    labelInValue
                    value={selectedCategory}
                    onSelect={onSelectCategory}
                    disabled={!categories || categories.length === 0}
                    options={categories}
                  />
                </Col>
                <Col>
                  <h5>Subtype</h5>
                  <Select
                    style={{
                      width: "175px",
                    }}
                    labelInValue
                    value={selectedSubtype}
                    onSelect={onSelectSubtype}
                    disabled={!subtypes || subtypes.length === 0}
                    options={subtypes}
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
                    disabled={!subtypeId || subtypeId === ""}
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
            scroll={{ x: 500, y: 400 }}
            size="small"
            columns={columns}
            dataSource={items}
            rowKey="index"
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
                <UpdateAttachment
                  attachment={attachment}
                  onSaveSuccess={onUpdateSuccess}
                  onCancel={() => setShowUpdateDrawer(false)}
                ></UpdateAttachment>
      </Drawer>
    </React.Fragment>
  );
};

export default Attachments;
