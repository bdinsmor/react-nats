import React, { useState, useEffect } from "react";

import DataService from "../services/DataService";
import {
  notification,
  Checkbox,
  Switch,
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

import * as _dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

const dayjs = _dayjs.extend(relativeTime);

const UpdateConfiguration = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);

      form.setFieldsValue(props.configuration);

      setIsLoading(false);
    };
    init();
  }, [form, props.configuration]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const configurationUpdates = {
        sizeClassId: props.configuration.sizeClassId,
        modelId: values.configuration.modelId,
        modelYear: values.configuration.modelYear,
        vinModelNumber: values.configuration.vinModelNumber,
      };

      await DataService.updateUser(configurationUpdates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Configuration Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Configuration",
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
                Configuration {props.configuration.configurationId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="sizeClassId"
              label="Size Class Id"
              rules={[
                {
                  required: true,
                  message: "Size Class Id cannot be empty",
                },
              ]}
            >
              <Input placeholder="Size Class Id" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="modelId"
              label="Model Id"
              rules={[
                {
                  required: true,
                  message: "Model Id cannot be empty",
                },
              ]}
            >
              <Input placeholder="Model Id" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="modelYear"
              label="Model Year"
              rules={[
                {
                  required: true,
                  message: "Model Year cannot be empty",
                },
              ]}
            >
              <Input placeholder="Model Year" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="vinModelNumber"
              label="VIN Model Number"
            >
              <Input placeholder="VIN Model Number" />
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

export default UpdateConfiguration;
