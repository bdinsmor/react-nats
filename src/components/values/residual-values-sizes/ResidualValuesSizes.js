import React, { useState, useEffect } from "react";
import DataService from "../../../services/DataService";
import { Space, Row, Col, Table, Layout, Select } from "antd";
import { ExportTableButton } from "ant-table-extensions";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;


const ResidualValuesSizes = (props) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});

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
    },
    {
      title: "Size Class Id",
      dataIndex: "sizeClassId",
      width: "150px",
      sorter: (a, b) => a.sizeClassId - b.sizeClassId,
    },
    {
      title: "1",
      dataIndex: "1",
      width: '100px',
      sorter: (a, b) => a['1'] - b['1'],
    },
    {
      title: "2",
      dataIndex: "2",
      width: '100px',
      sorter: (a, b) => a['2'] - b['2'],
    },
    {
      title: "3",
      dataIndex: "3",
      width: '100px',
      sorter: (a, b) => a['3'] - b['3'],
    },
    {
      title: "4",
      dataIndex: "4",
      width: '100px',
      sorter: (a, b) => a['4'] - b['4'],
    },
    {
      title: "5",
      dataIndex: "5",
      width: '100px',
      sorter: (a, b) => a['5'] - b['5'],
    },
    {
      title: "6",
      dataIndex: "6",
      width: '100px',
      sorter: (a, b) => a['6'] - b['6'],
    },
    {
      title: "7",
      dataIndex: "7",
      width: '100px',
      sorter: (a, b) => a['7'] - b['7'],
    },
    {
      title: "8",
      dataIndex: "8",
      width: '100px',
      sorter: (a, b) => a['8'] - b['8'],
    },
    {
      title: "9",
      dataIndex: "9",
      width: '100px',
      sorter: (a, b) => a['9'] - b['9'],
    },
    {
      title: "10",
      dataIndex: "10",
      width: '100px',
      sorter: (a, b) => a['10'] - b['10'],
    },
    {
      title: "11",
      dataIndex: "11",
      width: '100px',
      sorter: (a, b) => a['11'] - b['11'],
    },
    {
      title: "12",
      dataIndex: "12",
      width: '100px',
      sorter: (a, b) => a['12'] - b['12'],
    },
    {
      title: "13",
      dataIndex: "13",
      width: '100px',
      sorter: (a, b) => a['13'] - b['13'],
    },
    {
      title: "14",
      dataIndex: "14",
      width: '100px',
      sorter: (a, b) => a['14'] - b['14'],
    },
    {
      title: "15",
      dataIndex: "15",
      width: '100px',
      sorter: (a, b) => a['15'] - b['15'],
    },
    {
      title: "16",
      dataIndex: "16",
      width: '100px',
      sorter: (a, b) => a['16'] - b['16'],
    },
    {
      title: "17",
      dataIndex: "17",
      width: '100px',
      sorter: (a, b) => a['17'] - b['17'],
    },
    {
      title: "18",
      dataIndex: "18",
      width: '100px',
      sorter: (a, b) => a['18'] - b['18'],
    },
    {
      title: "19",
      dataIndex: "19",
      width: '100px',
      sorter: (a, b) => a['19'] - b['19'],
    },
    {
      title: "20",
      dataIndex: "20",
      width: '100px',
      sorter: (a, b) => a['20'] - b['20'],
    },
    {
      title: "21",
      dataIndex: "21",
      width: '100px',
      sorter: (a, b) => a['21'] - b['21'],
    },
    {
      title: "22",
      dataIndex: "22",
      width: '100px',
      sorter: (a, b) => a['22'] - b['22'],
    },
    {
      title: "23",
      dataIndex: "23",
      width: '100px',
      sorter: (a, b) => a['23'] - b['23'],
    },
    {
      title: "24",
      dataIndex: "24",
      width: '100px',
      sorter: (a, b) => a['24'] - b['24'],
    },
    {
      title: "25",
      dataIndex: "25",
      width: '100px',
      sorter: (a, b) => a['25'] - b['25'],
    },
    {
      title: "26",
      dataIndex: "26",
      width: '100px',
      sorter: (a, b) => a['26'] - b['26'],
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      width: '200px',
      sorter: (a, b) => a.formattedDate - b.formattedDate,
    },
    {
      title: "Last Modified By",
      dataIndex: "user",
      width: '200px',
      sorter: (a, b) => a.user.localeCompare(b.user),
     
    },
  ];

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
    const res = await DataService.getResidualValuesSizes(value.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setItems(res);
    setIsDataLoading(false);
  };


  const init = async function () {
    setIsLoading(true);
    populateClassifications();
    setIsLoading(false);
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
            style={{width: '100%',maxWidth: 'calc(100vw - 275px)'}}
            size="small"
            loading={isDataLoading}
            pagination={{
              hideOnSinglePage: true,
              pageSize: items ? items.length : 10,
            }}
          />
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default ResidualValuesSizes;
