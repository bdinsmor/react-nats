import React, { useState, useEffect } from "react";
import DataService from "../../services/DataService";
import CreateManufacturerAlias from "./CreateManufacturerAlias";
import UpdateManufacturerAlias from "./UpdateManufacturerAlias";
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
import debounce from "lodash/debounce";

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

const ManufacturerAliases = (props) => {
  const [manufacturerId, setManufacturerId] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
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

    const res = await DataService.getAliasesForManufacturer(option.value);
    let index = 1;
    res.forEach(function (element) {
      element.index = index;
      index++;
    });
    setItems(res);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: '5%',
    },
    {
      title: "Manufacturer Id",
      dataIndex: "manufacturerId",
      editable: true,
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturerName",
      editable: true,
    },
    {
      title: "Alias",
      dataIndex: "manufacturerAlias",
      editable: true,
    },
    
    {
      title: "Last Modified",
      dataIndex: "ts",
      editable: true,
    },
    {
      title: "Last Modified By" ,
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

  const openCreateDrawer = () => {
    setShowCreateDrawer(true);
  };
  const onCreateSuccess = () => {
    setShowCreateDrawer(false);
    init();
  };
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
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        >
          <div style={{ marginBottom: 8, paddingLeft: 16 }}>
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
          <div style={{ marginBottom: 16 }}></div>
          <Table
            columns={columns}
            dataSource={items}
            rowKey="manufacturerId"
          />
        </Content>
      </Layout>
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setShowCreateDrawer(false)}
        visible={showCreateDrawer}
        width={600}
      >
        <CreateManufacturerAlias
          onSaveSuccess={onCreateSuccess}
          onCancel={() => setShowCreateDrawer(false)}
        ></CreateManufacturerAlias>
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setShowUpdateDrawer(false)}
        visible={showUpdateDrawer}
        width={600}
      >
        <UpdateManufacturerAlias
          manufacturer={item}
          onSaveSuccess={onUpdateSuccess}
          onCancel={() => setShowUpdateDrawer(false)}
        ></UpdateManufacturerAlias>
      </Drawer>
    </React.Fragment>
  );
};

export default ManufacturerAliases;
