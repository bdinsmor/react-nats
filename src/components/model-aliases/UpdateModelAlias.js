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


const UpdateModelAlias = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(props.isNew);
      console.log("model alias: " + JSON.stringify(props.modelAlias,null,2))
      form.setFieldsValue(props.modelAlias);

      setIsLoading(false);
    };
    init();
  }, [form, props.isNew, props.modelAlias]);

  const save = async (values) => {
    setIsLoading(true);
  
    try {
      const updates = {
        modelId: props.modelAlias.modelId,
        model: props.modelAlias.model,
        modelAlias: values.modelAlias,
      };
      console.log("updates: " + JSON.stringify(updates,null,2))
      await DataService.updateModelAlias(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Model Alias Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Model Alias",
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
                Model Alias
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
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
              <Input placeholder="Model Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="model"
              label="Model"
              rules={[
                {
                  required: true,
                  message: "Model cannot be empty",
                },
              ]}
            >
              <Input placeholder="Model Name" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="modelAlias"
              label="Model Alias"
            >
              <Input placeholder="Model Alias" />
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

export default UpdateModelAlias;
