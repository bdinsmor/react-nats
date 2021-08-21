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

const UpdateSpec = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);

      form.setFieldsValue(props.spec);

      setIsLoading(false);
    };
    init();
  }, [form, props.spec]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        id: props.spec.id,
        configurationId: props.spec.configurationId,
        specFamily: props.spec.specFamily,
        specUom: values.spec.specUom,
        specDescription: values.spec.specDescription,
        specNameFriendly: values.spec.sepcNameFriendly,
        specName: values.spec.specName,
        specValue: values.spec.specValue
      };

      await DataService.updateOption(updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Spec Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Spec",
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
          <Col span={12}>
            <div>
              <Typography style={{ fontSize: "20px" }}>
                Spec for Configuation Id: {props.spec.configurationId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="specFamily"
              label="Family"
              rules={[
                {
                  required: true,
                  message: "Spec Family cannot be empty",
                },
              ]}
            >
              <Input placeholder="Spec Family" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="specValue"
              label="Value"
              rules={[
                {
                  required: true,
                  message: "Spec Value cannot be empty",
                },
              ]}
            >
              <Input placeholder="Spec Value" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="specName"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Spec Name cannot be empty",
                },
              ]}
            >
              <Input placeholder="Spec Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="specUom"
              label="UoM"
              rules={[
                {
                  required: true,
                  message: "Spec Uom cannot be empty",
                },
              ]}
            >
              <Input placeholder="Spec Uom" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="specNameFriendly"
              label="Friendly Name"
              rules={[
                {
                  required: true,
                  message: "Spec Name cannot be empty",
                },
              ]}
            >
              <Input placeholder="Spec Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="specDescription"
              label="Description"
              
            >
              <Input.TextArea showCount placeholder="Description"/>
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
              type="ghost"
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

export default UpdateSpec;
