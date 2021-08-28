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


const UpdateSizeClass = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(false);
      form.setFieldsValue(props.sizeClass);

      setIsLoading(false);
    };
    init();
  }, [form, props.sizeClass]);



  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        subtypeId: props.sizeClass.subtypeId,
        sizeClassId: props.sizeClass.sizeClassId,
        sizeClassMin: values.sizeClassMin,
        sizeClassMax: values.sizeClassMax,
        sizeClassUom: values.sizeClassUom,
        sizeClassName: values.sizeClassName
      };

      await DataService.updateSizeClass(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Size Class Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Size Class",
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
              Update Size Class
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
              >
              <Input placeholder="Size Class Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="subtypeId"
              label="Subtype Id"
            >
              <Input placeholder="Subtype Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="sizeClassName"
              label="Size Class Name"
              rules={[
                {
                  required: true,
                  message: "Size Class Name cannot be empty",
                },
              ]}
            >
              <Input placeholder="Size Class Name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="sizeClassMin"
              label="Size Class Min"
              rules={[
                {
                  required: true,
                  message: "Size Class Min cannot be empty",
                },
              ]}
            >
              <Input placeholder="Size Class Min" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="sizeClassMax"
              label="Size Class Max"
              rules={[
                {
                  required: true,
                  message: "Size Class Max cannot be empty",
                },
              ]}
            >
              <Input placeholder="Size Class Max" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="sizeClassUom"
              label="Size Class UOM"
              rules={[
                {
                  required: true,
                  message: "Size Class Uom cannot be empty",
                },
              ]}
            >
              <Input placeholder="Size Class Uom" />
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

export default UpdateSizeClass;
