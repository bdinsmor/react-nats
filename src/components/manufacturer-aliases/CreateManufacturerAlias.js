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


const UpdateTaxonomy = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);

      form.setFieldsValue(props.manufacturer);

      setIsLoading(false);
    };
    init();
  }, [form, props.manufacturer]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const modelAliasUpdates = {
        modelId: props.manufacturer.modelId,
        modelAlias: values.manufacturer.modelAlias
      };

      await DataService.updateManufacturerAlias(modelAliasUpdates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Model Alias Saved",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Saving Model Alias",
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
                Create Manufacturer Alias
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Form.Item
              name="manufacturerId"
              rules={[
                {
                  required: true,
                  message: "Manufacturer Id cannot be empty",
                },
              ]}
            >
              <Input placeholder="Manufacturer Id" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="manufacturerName"
              rules={[
                {
                  required: true,
                  message: "Manufacturer cannot be empty",
                },
              ]}
            >
              <Input placeholder="Manufacturer Alias" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="manufacturerAlias"
              rules={[
                {
                  required: true,
                  message: "Manufacturer Alias cannot be empty",
                },
              ]}
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

export default UpdateTaxonomy;
