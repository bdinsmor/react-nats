import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import { Space, Row, Col, Menu, Table, Drawer, Layout, Select, Dropdown, Button } from "antd";
import {Link} from 'react-router-dom';

import { DownOutlined} from '@ant-design/icons';
import UpdateClassification from "./UpdateClassification";
import UpdateCategory from "./UpdateCategory";
import UpdateSubtype from "./UpdateSubtype";
import UpdateSizeClass from "./UpdateSizeClass";
import UpdateManufacturer from "./UpdateManufacturer";
import UpdateModel from "./UpdateModel";

const { Content } = Layout;

const Taxonomys = (props) => {
  const [isLoading, setIsLoading] = useState(true);

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

  const [clickedSizeClassId, setClickedSizeClassId] = useState("");

  const [columns, setColumns] = useState([]);

  const getConditionLink = () => {
    return "/condition-adjustments?sizeClassId=" + clickedSizeClassId;
  }
  const getRegionLink = () => {
    return "/region-adjustments?sizeClassId=" + clickedSizeClassId;
  }
  const getUtilizationLink = () => {
    return "/utilization-adjustments?sizeClassId=" + clickedSizeClassId;
  }

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
      editable: true,
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
          <Button type="link" onClick={() => openUpdateDrawer(record)}>
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
      editable: true,
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
          <Button type="link" onClick={() => openUpdateDrawer(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const optionsMenu = (
    <Menu>
      <Menu.Item>
      <Link to={getConditionLink}>Condition Adjustments</Link>
      </Menu.Item>
      <Menu.Item>
      <Link to={getRegionLink}>Region Adjustments</Link>
      </Menu.Item>
      <Menu.Item><Link to={getUtilizationLink}>Utilization Adjustments</Link>
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
      editable: true,
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
          <Button type="link" onClick={() => openUpdateDrawer(record)}>
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
      editable: true,
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
          <Button type="link" onClick={() => openUpdateDrawer(record)}>
            Edit
          </Button>
          <Dropdown overlay={optionsMenu}>
    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
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
      editable: true,
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
          <Button type="link" onClick={() => openUpdateDrawer(record)}>
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
      editable: true,
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
          <Button type="link" onClick={() => openUpdateDrawer(record)}>
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
    setIsLoading(true);
    setRowKey("classificationId");
    populateClassifications();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
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

  return (
    <React.Fragment>
      <Layout>
        <Content
          style={{
            paddingTop: 12,
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        >
          <div style={{ marginBottom: 8, paddingLeft: 16 }}>
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
          <div style={{ paddingLeft: 16, marginBottom: 8}}>
          <Row gutter={12}>
          <Col span={24}>
           
            <Button type="ghost">Export</Button>
            
          </Col>
          </Row>
          </div>
          <div style={{ marginBottom: 16 }}></div>
          <Table columns={columns} dataSource={items} rowKey={rowKey} />
        </Content>
      </Layout>

      <Drawer
        placement="right"
        closable={false}
        onClose={() => setShowUpdateDrawer(false)}
        visible={showUpdateDrawer}
        width={600}
      >
        {
      (()=> {
        switch (currentView) {
          case 'classification': return <UpdateClassification classification={taxonomy} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdateClassification>;
          case 'category': return <UpdateCategory category={taxonomy} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdateCategory>;
          case 'subtype': return <UpdateSubtype subtype={taxonomy} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdateSubtype>;
          case 'sizeClass': return <UpdateSizeClass sizeClass={taxonomy} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdateSizeClass>;
          case 'manufacturer': return <UpdateManufacturer manufacturer={taxonomy} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdateManufacturer>;
          case 'model': return <UpdateModel model={taxonomy} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdateModel>;
          default: return null;
        }
      })()
     }
        
      </Drawer>
    </React.Fragment>
  );
};

export default Taxonomys;
