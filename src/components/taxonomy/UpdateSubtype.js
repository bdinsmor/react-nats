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


const UpdateSubtype = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);

      form.setFieldsValue(props.subtype);

      setIsLoading(false);
    };
    init();
  }, [form, props.subtype]);



  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        categoryId: props.subtype.categoryId,
        subTypeId: props.subtype.subtypeId,
        subTypeName: props.subtype.subTypeName
      };

      await DataService.updateSubtype(updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Subtype Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Subtype",
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
              Update Subtype
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
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
              name="categoryId"
              label="Category Id"
            >
              <Input placeholder="Category Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="subtypeName"
              label="Subtype Name"
              rules={[
                {
                  required: true,
                  message: "Subtype Name cannot be empty",
                },
              ]}
            >
              <Input placeholder="Subtype Name" />
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

export default UpdateSubtype;
