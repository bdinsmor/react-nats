import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import UpdateManufacturerVin from "./UpdateManufacturerVin";

import { EditOutlined } from "@ant-design/icons";
import {
  Space,
  Row,
  Col,
  Table,
  Drawer,
  Layout,
  Select,
  Spin,
  Button,
} from "antd";
import { ExportTableButton } from "ant-table-extensions";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);
const { Content } = Layout;

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

const ManufacturerVins = (props) => {
  const [manufacturerId, setManufacturerId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [selectedManufacturer, setSelectedManufacturer] = useState([]);

  const handleManufacturerSearch = async (value) => {
    const res = await DataService.getManufacturers(value);
    const manuResults = res.map((item) => ({
      label: `${item.manufacturerName}`,
      value: item.manufacturerId,
    }));
    return manuResults;
  };

  const onManufacturerSelect = async (option) => {
    setItems([]);
    if (!option || option === null) {
      setSelectedManufacturer(null);
      setManufacturerId(null);

      return;
    }
    setSelectedManufacturer(option);
    setManufacturerId(option.value);
    setIsDataLoading(true);
    const res = await DataService.getVINsForManufacturer(option.value);
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
      width: '50px',
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Model Year",
      dataIndex: "modelYear",
      sorter: (a, b) => a.modelYear - b.modelYear,
    },
    {
      title: "Vin Manufacturer Code",
      dataIndex: "vinManufacturerCode",
      sorter: (a, b) => a.vinManufacturerCode - b.vinManufacturerCode,
    },
    {
      title: "Vin Year Code",
      dataIndex: "vinYearCode",
      sorter: (a, b) => a.vinYearCode - b.vinYearCode,
    },
    {
      title: "Short Vin",
      dataIndex: "shortVin",
      sorter: (a, b) => a.shortVin - b.shortVin,
    },
    {
      title: "Cic Code",
      dataIndex: "cicCode",
      sorter: (a, b) => a.cicCode - b.cicCode,
    },
    {
      title: "Last Modified",
      dataIndex: "formattedDate",
      sorter: (a, b) => a.formattedDate - b.formattedDate,
    },
    {
      title: "Last Modified By" ,
      dataIndex: "user",
      sorter: (a, b) => a.user - b.user,
    },
    {
      title: "",
      key: "action",width: '50px',
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

  const onAdd = () => {
    setItem({manufacturerId: manufacturerId, manufacturerName: selectedManufacturer.label});
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
              </Space>
            </Row>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Col span={24}>
                <Space>
                  <Button
                    type="ghost"
                    onClick={onAdd}
                    disabled={!manufacturerId || manufacturerId === ""}
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
            scroll={{ x: 1500, y: 400 }}
            rowKey="id"
            size="small"
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
        <UpdateManufacturerVin
          manufacturerVin={item}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateManufacturerVin>
      </Drawer>
    </React.Fragment>
  );
};

export default ManufacturerVins;