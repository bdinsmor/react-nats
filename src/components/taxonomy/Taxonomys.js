import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import {
  Space,
  Row,
  Col,
  Menu,
  Table,
  Drawer,
  Layout,
  Select,
  Dropdown,
  Button,
} from "antd";
import { Link } from "react-router-dom";

import { DownOutlined, EditOutlined } from "@ant-design/icons";
import UpdateClassification from "./UpdateClassification";
import UpdateCategory from "./UpdateCategory";
import UpdateSubtype from "./UpdateSubtype";
import UpdateSizeClass from "./UpdateSizeClass";
import UpdateManufacturer from "./UpdateManufacturer";
import UpdateModel from "./UpdateModel";

import dayjs from "dayjs";
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);

const { Content } = Layout;

const Taxonomys = (props) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [classifications, setClassifications] = useState([]);
  const [classificationId, setClassificationId] = useState("");
  const [selectedClassification, setSelectedClassification] = useState({});

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});

  const [subtypes, setSubtypes] = useState([]);
  const [subtypeId, setSubtypeId] = useState({});
  const [selectedSubtype, setSelectedSubtype] = useState({});

  const [sizeClasses, setSizeClasses] = useState([]);
  const [sizeClassId, setSizeClassId] = useState("");
  const [selectedSizeClass, setSelectedSizeClass] = useState({});

  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturerId, setManufacturerId] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState({});

  const [items, setItems] = useState([]);
  const [rowKey, setRowKey] = useState("");
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [taxonomy, setTaxonomy] = useState({});
  const [currentView, setCurrentView] = useState("");

  const [columns, setColumns] = useState([]);

  const getConditionLink = (record) => {
    if (!record || !record.sizeClassId) {
      return "";
    }
    return "/condition-adjustments?sizeClassId=" + record.sizeClassId;
  };
  const getRegionLink = (record) => {
    if (!record || !record.sizeClassId) {
      return "";
    }
    return "/region-adjustments?sizeClassId=" + record.sizeClassId;
  };
  const getUtilizationLink = (record) => {
    if (!record || !record.sizeClassId) {
      return "";
    }
    return "/utilization-adjustments?sizeClassId=" + record.sizeClassId;
  };

  const resetChoices = () => {
    setSelectedCategory({});
    setSelectedClassification({});
    setSelectedManufacturer({});
    setSelectedSizeClass({});
    setSelectedSubtype({});
    setCategories([]);
    setSubtypes([]);
    setSizeClasses([]);
    setManufacturers([]);
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
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setRowKey("classificationId");
    setItems(res);
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
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setRowKey("categoryId");
    setItems(res);
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
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setRowKey("subtypeId");
    setItems(res);
    setIsDataLoading(false);
  };

  const onSelectSubtype = (value) => {
    setSubtypeId(value.value);
    setSelectedSubtype(value);
  };

  const populateSizeClasses = async () => {
    if (!classificationId || classificationId === "") {
      return;
    }
    if (!categoryId || categoryId === "") {
      return;
    }
    if (!subtypeId || subtypeId === "") {
      return;
    }
    const res = await DataService.getSizeClasses(
      classificationId,
      categoryId,
      subtypeId
    );
    const options = res.map((item) => ({
      label: `${item.sizeClassName} (${item.sizeClassMin} - ${item.sizeClassMax} ${item.sizeClassUom})`,
      value: item.sizeClassId,
      key: item.sizeClassId,
    }));
    setSizeClasses(options);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setRowKey("sizeClassId");
    setItems(res);
    setIsDataLoading(false);
  };

  const onSelectSizeClass = (value) => {
    setSizeClassId(value.value);
    setSelectedSizeClass(value);
  };

  const populateManufacturers = async () => {
    if (!sizeClassId || sizeClassId === "") {
      return;
    }
    const res = await DataService.getManufacturersForSizeClassId(sizeClassId);
    const options = res.map((item) => ({
      label: `${item.manufacturerName}`,
      value: item.manufacturerId,
      key: item.manufacturerId,
    }));
    setManufacturers(options);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setRowKey("manufacturerId");
    setItems(res);
    setIsDataLoading(false);
  };

  const onSelectManufacturer = async (value) => {
    setManufacturerId(value.value);
    setSelectedManufacturer(value);
    const res = await DataService.getTaxonomyModels(sizeClassId, value.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setRowKey("modelId");
    setItems(res);
    setIsDataLoading(false);
  };

  const classificationColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
    },
    {
      title: "Classification Id",
      dataIndex: "classificationId",
      width: "15%",
    },
    {
      title: "Classification Name",
      dataIndex: "classificationName",
      editable: true,
    },
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      editable: true,
    },
    {
      title: "",
      key: "action",
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

  const categoryColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
    },
    {
      title: "Category Id",
      dataIndex: "categoryId",
      width: "10%",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      editable: true,
    },
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      editable: true,
    },
    {
      title: "",
      key: "action",
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

  const optionsMenu = (record) => (
    <Menu>
      <Menu.Item>
        <Link to={getConditionLink(record)}>Condition Adjustments</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={getRegionLink(record)}>Region Adjustments</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={getUtilizationLink(record)}>Utilization Adjustments</Link>
      </Menu.Item>
    </Menu>
  );

  const subtypeColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
    },
    {
      title: "Subtype Id",
      dataIndex: "subtypeId",
      width: "10%",
    },
    {
      title: "Subtype Name",
      dataIndex: "subtypeName",
      editable: true,
    },
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      editable: true,
    },
    {
      title: "",
      key: "action",
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

  const sizeClassColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
    },
    {
      title: "Size Class Id",
      dataIndex: "sizeClassId",
      width: "10%",
    },
    {
      title: "Size Class Name",
      dataIndex: "sizeClassName",
      editable: true,
    },
    {
      title: "Min",
      dataIndex: "sizeClassMin",
      editable: true,
    },
    {
      title: "Max",
      dataIndex: "sizeClassMax",
      editable: true,
    },
    {
      title: "Uom",
      dataIndex: "sizeClassUom",
      editable: true,
    },
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      editable: true,
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openUpdateDrawer(record)}
          >
            Edit
          </Button>
          <Dropdown overlay={optionsMenu(record)}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              Options <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const manufacturerColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
    },
    {
      title: "Manufacturer Id",
      dataIndex: "manufacturerId",
      width: "15%",
    },
    {
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      editable: true,
    },
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      editable: true,
    },
    {
      title: "",
      key: "action",
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

  const modelColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
    },
    {
      title: "Model Id",
      dataIndex: "modelId",
      width: "10%",
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      editable: true,
    },
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      editable: true,
    },
    {
      title: "",
      key: "action",
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

  const openUpdateDrawer = (item) => {
    setTaxonomy(item);
    setShowUpdateDrawer(true);
  };
  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
    init();
  };

  const init = async function () {
    setIsDataLoading(true);
    setRowKey("classificationId");
    populateClassifications();
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    clearRows();
    setSelectedCategory({});
    setSizeClassId("");
    setSizeClasses([]);
    setSubtypeId("");
    setSubtypes([]);
    setSelectedSizeClass({});
    setSelectedSubtype({});
    setManufacturerId("");
    setSelectedManufacturer({});
    setManufacturers([]);
    if (!classificationId || classificationId === "") {
      return;
    }
    populateCategories();
  }, [classificationId]);

  useEffect(() => {
    clearRows();
    setSizeClassId("");
    setSizeClasses([]);
    setSubtypeId("");
    setSelectedSubtype({});
    setSelectedSizeClass({});
    setSelectedManufacturer({});
    setSubtypes([]);
    setManufacturerId("");
    setManufacturers([]);
    if (!categoryId || categoryId === "") {
      return;
    }
    populateSubtypes();
  }, [categoryId]);

  useEffect(() => {
    clearRows();
    setManufacturerId("");
    setSelectedSizeClass({});
    setManufacturers([]);
    setSelectedManufacturer({});
    if (!subtypeId || subtypeId === "") {
      return;
    }
    populateSizeClasses();
  }, [subtypeId]);

  useEffect(() => {
    if (!sizeClassId || sizeClassId === "") {
      return;
    }
    clearRows();
    populateManufacturers();
  }, [sizeClassId]);

  useEffect(() => {
    switch (rowKey) {
      case "classificationId":
        setCurrentView("classification");
        setColumns(classificationColumns);
        break;
      case "categoryId":
        setCurrentView("category");
        setColumns(categoryColumns);
        break;
      case "subtypeId":
        setCurrentView("subtype");
        setColumns(subtypeColumns);
        break;
      case "sizeClassId":
        setCurrentView("sizeClass");
        setColumns(sizeClassColumns);
        break;
      case "manufacturerId":
        setCurrentView("manufacturer");
        setColumns(manufacturerColumns);
        break;
      case "modelId":
        setCurrentView("model");
        setColumns(modelColumns);
        break;
      default:
        setColumns(classificationColumns);
    }
  }, [rowKey]);

  const clearRows = () => {
    setIsDataLoading(true);
    setItems([]);
  };

  return (
    <React.Fragment>
      <Layout>
        <Content
          style={{
            paddingTop: 12,
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
                      width: "210px",
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
                      width: "210px",
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
                      width: "210px",
                    }}
                    labelInValue
                    value={selectedSubtype}
                    onSelect={onSelectSubtype}
                    disabled={!subtypes || subtypes.length === 0}
                    options={subtypes}
                  />
                </Col>
                <Col>
                  <h5>Size Class</h5>
                  <Select
                    style={{
                      width: "210px",
                    }}
                    labelInValue
                    value={selectedSizeClass}
                    onSelect={onSelectSizeClass}
                    disabled={!sizeClasses || sizeClasses.length === 0}
                    options={sizeClasses}
                  />
                </Col>
                <Col>
                  <h5>Manufacturer</h5>
                  <Select
                    style={{
                      width: "210px",
                    }}
                    labelInValue
                    value={selectedManufacturer}
                    onSelect={onSelectManufacturer}
                    disabled={!manufacturers || manufacturers.length === 0}
                    options={manufacturers}
                  />
                </Col>
              </Space>
            </Row>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Space>
                  <Button type="ghost">Export</Button>
                </Space>
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}></div>
          <Table
            style={{ height: "400px" }}
            scroll={{ y: 400 }}
            size="small"
            columns={columns}
            dataSource={items}
            rowKey={rowKey}
            loading={isDataLoading}
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
        {(() => {
          switch (currentView) {
            case "classification":
              return (
                <UpdateClassification
                  classification={taxonomy}
                  onSaveSuccess={onUpdateSuccess}
                  onCancel={() => setShowUpdateDrawer(false)}
                ></UpdateClassification>
              );
            case "category":
              return (
                <UpdateCategory
                  category={taxonomy}
                  onSaveSuccess={onUpdateSuccess}
                  onCancel={() => setShowUpdateDrawer(false)}
                ></UpdateCategory>
              );
            case "subtype":
              return (
                <UpdateSubtype
                  subtype={taxonomy}
                  onSaveSuccess={onUpdateSuccess}
                  onCancel={() => setShowUpdateDrawer(false)}
                ></UpdateSubtype>
              );
            case "sizeClass":
              return (
                <UpdateSizeClass
                  sizeClass={taxonomy}
                  onSaveSuccess={onUpdateSuccess}
                  onCancel={() => setShowUpdateDrawer(false)}
                ></UpdateSizeClass>
              );
            case "manufacturer":
              return (
                <UpdateManufacturer
                  manufacturer={taxonomy}
                  onSaveSuccess={onUpdateSuccess}
                  onCancel={() => setShowUpdateDrawer(false)}
                ></UpdateManufacturer>
              );
            case "model":
              return (
                <UpdateModel
                  model={taxonomy}
                  onSaveSuccess={onUpdateSuccess}
                  onCancel={() => setShowUpdateDrawer(false)}
                ></UpdateModel>
              );
            default:
              return null;
          }
        })()}
      </Drawer>
    </React.Fragment>
  );
};

export default Taxonomys;
