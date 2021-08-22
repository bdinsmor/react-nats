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
import { ExportTableButton } from "ant-table-extensions";
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
      element.key = index;
      element.formattedDate = dayjs(element.ts).format('lll');
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
      element.key = index;
      element.formattedDate = dayjs(element.ts).format('lll');
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
      element.key = index;
      element.formattedDate = dayjs(element.ts).format('lll');
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
      element.key = index;
      element.formattedDate = dayjs(element.ts).format('lll');
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
      element.key = index;
      element.formattedDate = dayjs(element.ts).format('lll');
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
      element.modelIdKey = index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setRowKey("modelIdKey");
    setItems(res);
    setIsDataLoading(false);
  };

  const classificationColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: '50px',
      fixed: "left",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Classification Id",
      dataIndex: "classificationId",
      width: '80px',
      sorter: (a, b) => a.classificationId - b.classificationId,
    },
    {
      title: "Classification Name",
      dataIndex: "classificationName",
      width: '100px',
      sorter: (a, b) => a.classificationName - b.classificationName,
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: '100px',
      sorter: (a, b) => a.formattedDate - b.formattedDate,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      width: '100px',
      sorter: (a, b) => a.user - b.user,
    },
    {
      title: "",
      key: "action",
      width: '50px',
      fixed: 'right',
      render: (text, record) => (
        <Space size="left">
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

  const categoryColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: '50px',
      fixed: "left",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Category Id",
      dataIndex: "categoryId",
      width: "80px",
      sorter: (a, b) => a.categoryId - b.categoryId,
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      width: "150px",
      sorter: (a, b) => a.categoryName - b.categoryName,
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
      width: "100px",
      sorter: (a, b) => a.user - b.user,
    },
    {
      title: "",
      key: "action",
      width: '50px',
      fixed: 'right',
      render: (text, record) => (
        <Space size="left">
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
      width: '50px',
      fixed: "left",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Subtype Id",
      dataIndex: "subtypeId",
      width: "80px",
      sorter: (a, b) => a.subtypeId - b.subtypeId,
    },
    {
      title: "Subtype Name",
      dataIndex: "subtypeName",
      width: "150px",
      sorter: (a, b) => a.subtypeName - b.subtypeName,
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
      width: "100px",
      sorter: (a, b) => a.user - b.user,
    },
    {
      title: "",
      key: "action",
      fixed: 'right',
      width: '50px',
      render: (text, record) => (
        <Space size="left">
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

  const sizeClassColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: '50px',
      fixed: "left",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Size Class Id",
      dataIndex: "sizeClassId",
      width: '80px',
      sorter: (a, b) => a.sizeClassId - b.sizeClassId,
    },
    {
      title: "Size Class Name",
      dataIndex: "sizeClassName",
      width: '100px',
      sorter: (a, b) => a.sizeClassName - b.sizeClassName,
    },
    {
      title: "Min",
      dataIndex: "sizeClassMin",
      width: '75px',
      sorter: (a, b) => a.sizeClassMin - b.sizeClassMin,
    },
    {
      title: "Max",
      dataIndex: "sizeClassMax",
      width: '75px',
      sorter: (a, b) => a.sizeClassMax - b.sizeClassMax,
    },
    {
      title: "Uom",
      dataIndex: "sizeClassUom",
      width: '50px',
      sorter: (a, b) => a.sizeClassUom - b.sizeClassUom,
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
      width: '150px',
      fixed: 'right',
      render: (text, record) => (
        <Space size="left">
          <Button
            type="link"
            size="small" style={{fontSize:'12px'}}  icon={<EditOutlined />}
            onClick={() => openUpdateDrawer(record)}
          >
            Edit
          </Button>
          <Dropdown size="small" overlay={optionsMenu(record)}>
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
      width: '50px',
      fixed: "left",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Manufacturer Id",
      dataIndex: "manufacturerId",
      width: '100px',
      sorter: (a, b) => a.manufacturerId - b.manufacturerId,
    },
    {
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      width: '150px',
      sorter: (a, b) => a.manufacturerName - b.manufacturerName,
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
      fixed: 'right',
      width: '50px',
      render: (text, record) => (
        <Space size="left">
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

  const modelColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: '50px',
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
      title: "Model Name",
      dataIndex: "modelName",
      width: '100px',
      sorter: (a, b) => a.modelName - b.modelName,
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
      width: '100px',
      sorter: (a, b) => a.user - b.user,
    },
    {
      title: "",
      key: "action",
      width: '50px',
      fixed: 'right',
      render: (text, record) => (
        <Space size="left">
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
      case "modelIdKey":
        setCurrentView("modelId");
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
                <Col>
                  <h5>Size Class</h5>
                  <Select
                    style={{
                      width: "175px",
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
                      width: "175px",
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
          <div style={{ marginBottom: 16 }}></div>
          <Table
            scroll={{ y: 400, x: 500 }}
            size="small"
            columns={columns}
            dataSource={items}
            rowKey={rowKey}
            loading={isDataLoading}
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
