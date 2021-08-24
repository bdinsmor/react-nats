import React, { useState, useEffect } from "react";

import DataService from "../../services/DataService";
import {
  notification,
  Input,
  Button,
  Row,
  Col,
  Form,
  Space,
  Divider,
  Typography,
  Skeleton,
} from "antd";


import { SaveOutlined, CloseOutlined } from "@ant-design/icons";


const UpdateManufacturerAlias = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(props.isNew);
      form.setFieldsValue(props.manufacturerAlias);

      setIsLoading(false);
    };
    init();
  }, [form, props.isNew, props.manufacturerAlias]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        id: props.manufacturerAlias.id,
        manufacturerId: props.manufacturerAlias.manufacturerId,
        manufacturerName: values.manufacturerName,
        manufacturerAlias: values.manufacturerAlias,
      };

      await DataService.updateUser(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Manufacturer Alias Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Manufacturer Alias",
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
                Manufacturer Alias
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
              rules={[
                {
                  required: true,
                  message: "Manufacturer Id cannot be empty",
                },
              ]}
            >
              <Input placeholder="Manufacturer Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="manufacturer"
              label="Manufacturer"
              rules={[
                {
                  required: true,
                  message: "Manufacturer cannot be empty",
                },
              ]}
            >
              <Input placeholder="Manufacturer" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="manufacturerAlias"
              label="Manufacturer Alias"
            >
              <Input placeholder="Manufacturer Alias" />
            </Form.Item>
          </Col>
        </Row>
        <Space>
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
          <Form.Item>
            <Button
              className="login-form-button"
              icon={<CloseOutlined />}
              onClick={() => cancel()}
            >
              Cancel
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Space>
  );
};

export default UpdateManufacturerAlias;
