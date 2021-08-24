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


const UpdateModel = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(false);
      form.setFieldsValue(props.model);

      setIsLoading(false);
    };
    init();
  }, [form, props.model]);



  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        modelId: props.model.modelId,
        manufacturerId: props.model.manufacturerId,
        modelName: values.modelName
      };

      await DataService.updateModel(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Model Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Model",
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
              Update Model
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
              >
              <Input placeholder="Model Id" disabled />
            </Form.Item>
          </Col>
        </Row>
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
              name="modelName"
              label="Model Name"
              rules={[
                {
                  required: true,
                  message: "Model Name cannot be empty",
                },
              ]}
            >
              <Input placeholder="Model Name" />
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

export default UpdateModel;
