import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import { notification, Row, Col, Layout, Space, Select, Spin, Button, Typography, Input } from "antd";
import dayjs from "dayjs";
import tables from "../../data/tables";
import debounce from "lodash/debounce";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const { Content } = Layout;
const { Text } = Typography;
const { Search } = Input;

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      showSearch
      showArrow={false}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

const Export = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState({});
  const [tableOptions, setTableOptions] = useState([]);
  const [exportSuccess, setExportSuccess] = useState(false);
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

  const [selectedModel, setSelectedModel] = useState({});
  const [modelId, setModelId] = useState('');

  const openExportNotification = () => {
    notification.open({
      message: 'Export Request Submitted',
      description:
        'Export request has been submitted. You will receive an email shortly with a progress update',
      className: 'export-message-class',
      duration: 10,
      style: {
        width: 600,
      },
    });
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

  const onSelectSizeClass = (value) => {
    setSizeClassId(value.value);
    setSelectedSizeClass(value);
  };

  const handleManufacturerSearch = async (value) => {
    const res = await DataService.getManufacturers(value);
    const manuResults = res.map((item) => ({
      label: `${item.manufacturerName}`,
      value: item.manufacturerId,
    }));
    return manuResults;
  };

  const handleModelSearch = async (value) => {
    if (!value || value === "") {
      return [];
    }
    const res = await DataService.getModelsForManufacturer(
      manufacturerId,
      value
    );
    const modelResults = res.map((item) => ({
      label: `${item.modelName}`,
      value: item.modelId,
    }));
    return modelResults;
  };

  const onManufacturerSelect = (option) => {
    setSelectedModel(null);
    handleModelSearch("");
    if (!option || option === null) {
      setSelectedManufacturer(null);
      setManufacturerId(null);
      return;
    }
    setSelectedManufacturer(option);
    setManufacturerId(option.value);
  };

  const onModelSelect = async (option) => {
    if (!option || option === null) {
      setModelId("");
      setSelectedModel(null);
      return;
    }
    setModelId(option.value);
    setSelectedModel(option);
  };


  const onTableSelect = (value) => {
    setSelectedTable(value);
    populateClassifications();
  }

  const init = async function () {
    setIsLoading(true);
    if(tables || tables.length > 0) {
      setTableOptions(tables.map((t) => {
        return {value: t.name, label: t.title};
      }));
    }
    
    setIsLoading(false);
  };

  const onExport = async() => {
    const postData = {
      tableName: selectedTable.value,
      query: {
        sizeClassId: selectedSizeClass.value,
        manufacturerId: selectedManufacturer.value,
        modelId: selectedModel.value,
        subtypeId: selectedSubtype.value,
        classificationId: selectedClassification.value,
        categoryId: selectedCategory.value
      }
    };
    const res = await DataService.exportTable(postData);
    openExportNotification();
  }


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
    setSubtypes([]);
    if (!categoryId || categoryId === "") {
      return;
    }
    populateSubtypes();
  }, [categoryId]);

  useEffect(() => {
    setSelectedSizeClass({});
    setSelectedManufacturer({});
    if (!subtypeId || subtypeId === "") {
      return;
    }
    populateSizeClasses();
  }, [subtypeId]);


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
            <Row gutter={12}  style={{marginBottom:'24px'}}>
              <Col>
                <h5>Table</h5>
                <Select
                  style={{
                    width: "175px",
                  }}
                  labelInValue
                  value={selectedTable}
                  disabled={!tableOptions || tableOptions.length === 0}
                  options={tableOptions}
                  onSelect={onTableSelect}
                />
              </Col>
            </Row>
            <Row gutter={12} style={{marginBottom:'24px'}}>
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
          
            <Row gutter={12} style={{marginBottom:'24px'}}>
              <Space>
                <Col>
                  <h5>Manufacturer</h5>
                  <DebounceSelect
                    placeholder="Search Manufacturers"
                    value={selectedManufacturer}
                    fetchOptions={handleManufacturerSearch}
                    allowClear={true}
                    onChange={onManufacturerSelect}
                    style={{
                      width: "300px",
                    }}
                  />
                </Col>
                <Col>
                  <h5>Model</h5>
                  <DebounceSelect
                    placeholder="Search Models"
                    value={selectedModel}
                    fetchOptions={handleModelSearch}
                    onChange={onModelSelect}
                    allowClear={true}
                    style={{
                      width: "300px",
                    }}
                  />
                </Col>
              </Space>
            </Row>
            <Row  style={{marginBottom: '24px'}}>
            <Button type="primary"onClick={onExport}>Export</Button>
            </Row>

        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default Export;
