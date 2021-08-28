import React, { useState, useEffect } from "react";

import DataService from "../../services/DataService";
import {
  notification,
  Button,
  Input,
  Row,
  Col,
  Form,
  Space,
  Divider,
  Typography,
  Skeleton,
} from "antd";


import { SaveOutlined, CloseOutlined } from "@ant-design/icons";


const UpdateManufacturer = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(false);
      form.setFieldsValue(props.manufacturer);

      setIsLoading(false);
    };
    init();
  }, [form, props.manufacturer]);



  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        manufacturerName: values.manufacturerName,
        manufacturerId: props.manufacturer.manufacturerId
      };

      await DataService.updateManufacturer(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Manufacturer Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Manufacturer",
        duration: 2,
      });
      setIsLoading(false);
    }
  };

  const cancel = () => {
    form.resetFields();
    if (props.onCancel) props.onCancel();
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Skeleton active loading={isLoading}></Skeleton>
      <Form
        scrollToFirstError={true}
        hidden={isLoading}
        onFinish={save}
        form={form}
        layout="vertical"
        hideRequiredMark
      >
        <Row align="middle">
          <Col>
            <div>
              <Typography style={{ fontSize: "20px" }}>
              Update Manufacturer
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="manufacturerId"
              label="Manufacturer Id"
              >
              <Input placeholder="Manufacturer Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="manufacturerName"
              label="Manufacturer Name"
              rules={[
                {
                  required: true,
                  message: "Manufacturer Name cannot be empty",
                },
              ]}
            >
              <Input placeholder="Manufacturer Name" />
            </Form.Item>
          </Col>
        </Row>

        <Space>
           <Form.Item>
            <Button
              className="login-form-button"
              icon={<CloseOutlined />}
              onClick={() => cancel()}
            >
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              icon={<SaveOutlined />}
              loading={isLoading}
            >
              Save
            </Button>
          </Form.Item>

        </Space>
      </Form>
    </Space>
  );
};

export default UpdateManufacturer;
