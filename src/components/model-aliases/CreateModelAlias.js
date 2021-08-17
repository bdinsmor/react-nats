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

const CreateConfiguration = (props) => {
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
        vinModelYear: values.configuration.vinModelYear,
      };

      await DataService.updateUser(configurationUpdates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Configuration Saved",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Saving Configuration",
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
                {props.configuration.configurationId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Form.Item
              name="sizeClassId"
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

export default CreateConfiguration;
