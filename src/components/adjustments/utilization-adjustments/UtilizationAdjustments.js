import React, { useState, useEffect } from "react";
import DataService from "../../../services/DataService";
import { Space, Drawer, Button, Row, Col, Table, Layout, Select, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ExportTableButton } from "ant-table-extensions";
import UpdateAdjustment from "./UpdateAdjustment";
import { useLocation } from 'react-router-dom';
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const UtilizationAdjustments = (props) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
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
      title: "Size Class Id",
      dataIndex: "sizeClassId",
      width: "120px",
      sorter: (a, b) => a.sizeClassId - b.sizeClassId,
    },
    {
      title: "Model Year",
      dataIndex: "modelYear",
      width: "100px",
      sorter: (a, b) => a.modelYear - b.modelYear,
    },
    {
      title: "Fuel Type",
      dataIndex: "fuelType",
      width: "120px",
      sorter: (a, b) => a.fuelType - b.fuelType,
    },
    {
      title: "Low Value",
      dataIndex: "lowValue",
      width: "120px",
      sorter: (a, b) => a.lowValue - b.lowValue,
    },
    {
      title: "High Value",
      dataIndex: "highValue",
      width: "120px",
      sorter: (a, b) => a.highValue - b.highValue,
    },
    {
      title: "Uom",
      dataIndex: "uom",
      width: "80px",
      sorter: (a, b) => a.uom - b.uom,
    },
    {
      title: "Retail Adj",
      dataIndex: "retailAdjustmentValue",
      width: "120px",
      sorter: (a, b) => a.retailAdjustmentValue - b.retailAdjustmentValue,
    },
    {
      title: "Finance Adj",
      dataIndex: "financeAdjustmentValue",
      width: "120px",
      sorter: (a, b) => a.financeAdjustmentValue - b.financeAdjustmentValue,
    },
    {
      title: "Wholesale Adj",
      dataIndex: "wholesaleAdjustmentValue",
      width: "120px",
      sorter: (a, b) => a.wholesaleAdjustmentValue - b.wholesaleAdjustmentValue,
    },
    {
      title: "TradeIn Adj",
      dataIndex: "tradeInAdjustmentValue",
      width: "120px",
      sorter: (a, b) => a.tradeInAdjustmentValue - b.tradeInAdjustmentValue,
    },
    {
      title: "Low Adj",
      dataIndex: "lowAdjustmentValue",
      width: "120px",
      sorter: (a, b) => a.lowAdjustmentValue - b.lowAdjustmentValue,
    },
    {
      title: "High Adj",
      dataIndex: "highAdjustmentValue",
      width: "120px",
      sorter: (a, b) => a.highAdjustmentValue - b.highAdjustmentValue,
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
      sorter: (a, b) => a.user - b.user,
    },
    {
      title: "",
      key: "action",
      width: '50px',
      fixed: "right",
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
    setItem({subtypeId: subtypeId});
    setIsNew(true);
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

  const resetChoices = () => {
    setSelectedCategory({});
    setSelectedClassification({});
    setSelectedSizeClass({});
    setSelectedSubtype({});
    setCategories([]);
    setSubtypes([]);
    setSizeClasses([]);
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
  };

  const onSelectSizeClass = async (value) => {
    setSizeClassId(value.value);
    setSelectedSizeClass(value);
    setIsDataLoading(true);
    const res = await DataService.getUtilizationAdjustments(value.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      element.formattedDate = dayjs(element.ts).format('lll');
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  };

  const query = useQuery();

  const init = async function () {
    setIsLoading(true);
    setIsNew(false);
    populateClassifications();
    setIsLoading(false);
    if(query) {
      let querySizeClassId = query.get("sizeClassId");
      if(querySizeClassId && querySizeClassId !== '') {
        setSizeClassId(querySizeClassId);
        onSelectSizeClass({value: querySizeClassId, label: querySizeClassId, key: querySizeClassId});
      } else {
        console.log("no query params")
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setSelectedSizeClass(null);
    populateSizeClasses();
  }, [selectedSubtype]);

  useEffect(() => {
    setSubtypes([]);
    setSelectedSubtype(null);
    setSelectedSizeClass(null);
    if(!selectedCategory || selectedCategory === null) {
      return;
    }
    populateSubtypes();
  }, [selectedCategory]);

  useEffect(() => {
    setSubtypes([]);
    setSelectedSubtype(null);
    setSelectedSizeClass(null);
    setSelectedCategory(null);
    setCategories([]);
    populateCategories();
  }, [selectedClassification]);

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
                    disabled={!sizeClassId || sizeClassId === ""}
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
            columns={columns}
            dataSource={items}
            scroll={{ x: 500, y: 400 }}
            rowKey="sizeClassId"
            size="small"
            loading={isDataLoading}
            style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
            pagination={{
              hideOnSinglePage: true,
              pageSize: items ? items.length : 10,
            }}
          />
          <Drawer
        placement="right"
        closable={false}
        onClose={() => setShowUpdateDrawer(false)}
        visible={showUpdateDrawer}
        width={600}
      >
        <UpdateAdjustment
          adjustment={item}
          isNew={isNew}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateAdjustment>
      </Drawer>
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default UtilizationAdjustments;
