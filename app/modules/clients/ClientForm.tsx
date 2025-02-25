import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  FormGroup,
  FormLabel,
  Container,
  FormControl,
  Button,
  FormCheck,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import useClient from "@/services/useClient";
import useModalStore from "@/shared/store/useModal";
import CurrencySelect from "@/shared/components/layout/CurrencySelect";
import ColorPickerInput from "../../shared/components/layout/ColorPickerInput";

export type ClientFormType = {
  id?: number;
  name: string;
  code: string;
  symbol: string;
  address: string;
  hourly_rate: number;
  hours_per_day: number;
  days_per_week: number;
  category: "FULL_TIME" | "PART_TIME";
  banner_color: string;
  headline_color: string;
  text_color: string;
  current_currency_code: string;
  convert_currency_code: string;
};

type ClientFormProps = {
  initialData?: Models.Client;
  isUpdate?: boolean;
};

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  isUpdate = false,
}) => {
  const { addClient, updateClient } = useClient();
  const { dismiss } = useModalStore();

  const formik = useFormik<ClientFormType>({
    initialValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      symbol: initialData?.symbol || "",
      address: initialData?.address || "",
      hourly_rate: initialData?.hourly_rate || 0,
      hours_per_day: initialData?.hours_per_day || 0,
      days_per_week: initialData?.days_per_week || 0,
      category: initialData?.category ? "FULL_TIME" : "PART_TIME",
      banner_color: initialData?.banner_color || "",
      headline_color: initialData?.headline_color || "",
      text_color: initialData?.text_color || "",
      current_currency_code: initialData?.current_currency_code || "",
      convert_currency_code: initialData?.convert_currency_code || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      code: Yup.string().required("Code is required"),
      symbol: Yup.string().required("Symbol is required"),
      address: Yup.string().required("Address is required"),
      hourly_rate: Yup.number().required("Hourly rate is required"),
      hours_per_day: Yup.number().required("Hours per day is required"),
      days_per_week: Yup.number().required("Days per week is required"),
      category: Yup.string().required("Category is required"),
      banner_color: Yup.string().required("Banner color is required"),
      headline_color: Yup.string().required("Headline color is required"),
      text_color: Yup.string().required("Text color is required"),
      current_currency_code: Yup.string().required(
        "Current currency code is required"
      ),
      convert_currency_code: Yup.string().required(
        "Convert currency code is required"
      ),
    }),
    onSubmit: async (values) => {
      try {
        if (isUpdate && initialData) {
          await updateClient(initialData.id ?? 0, values);
          toast.success("Client updated successfully");
          dismiss();
        } else {
          await addClient(values);
          toast.success("Client added successfully");
          dismiss();
        }
      } catch (error) {
        toast.error("Failed to submit client data");
      }
    },
  });

  return (
    <Container>
      <Form onSubmit={formik.handleSubmit}>
        {/* Identification Group */}
        <FormGroup>
          <Row>
            <Col md={6}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl
                type="text"
                name="name"
                id="name"
                placeholder="Enter client name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                isInvalid={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && (
                <div className="text-danger">{formik.errors.name}</div>
              )}
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="code">Code</FormLabel>
              <FormControl
                type="text"
                name="code"
                id="code"
                placeholder="Enter client code"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.code}
                isInvalid={formik.touched.code && Boolean(formik.errors.code)}
              />
              {formik.touched.code && (
                <div className="text-danger">{formik.errors.code}</div>
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <FormGroup>
                <FormLabel htmlFor="address">Address</FormLabel>
                <FormControl
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter client address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  isInvalid={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                />
                {formik.touched.address && (
                  <div className="text-danger">{formik.errors.address}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </FormGroup>
        <hr />

        {/* Financial Details Group */}
        <FormGroup className="mt-3">
          <Row>
            <Col md={4}>
              <FormLabel htmlFor="hourly_rate">Hourly Rate</FormLabel>
              <FormControl
                type="number"
                name="hourly_rate"
                id="hourly_rate"
                placeholder="Enter hourly rate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.hourly_rate}
                isInvalid={
                  formik.touched.hourly_rate &&
                  Boolean(formik.errors.hourly_rate)
                }
              />
              {formik.touched.hourly_rate && (
                <div className="text-danger">{formik.errors.hourly_rate}</div>
              )}
            </Col>
            <Col md={4}>
              <FormLabel htmlFor="hours_per_day">Hours per Day</FormLabel>
              <FormControl
                type="number"
                name="hours_per_day"
                id="hours_per_day"
                placeholder="Enter hours per day"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.hours_per_day}
                isInvalid={
                  formik.touched.hours_per_day &&
                  Boolean(formik.errors.hours_per_day)
                }
              />
              {formik.touched.hours_per_day && (
                <div className="text-danger">{formik.errors.hours_per_day}</div>
              )}
            </Col>
            <Col md={4}>
              <FormLabel htmlFor="days_per_week">Days per week</FormLabel>
              <FormControl
                type="number"
                name="days_per_week"
                id="days_per_week"
                placeholder="Enter hours per day"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.days_per_week}
                isInvalid={
                  formik.touched.days_per_week &&
                  Boolean(formik.errors.days_per_week)
                }
              />
              {formik.touched.days_per_week && (
                <div className="text-danger">{formik.errors.days_per_week}</div>
              )}
            </Col>
          </Row>
        </FormGroup>

        <hr />

        <FormGroup className="mt-3">
          <Row>
            <Col md={4}>
              <FormLabel htmlFor="symbol">Symbol</FormLabel>
              <FormControl
                disabled={true}
                type="text"
                name="symbol"
                id="symbol"
                placeholder="Enter client symbol"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.symbol}
                isInvalid={
                  formik.touched.symbol && Boolean(formik.errors.symbol)
                }
              />
              {formik.touched.symbol && (
                <div className="text-danger">{formik.errors.symbol}</div>
              )}
            </Col>
            <Col>
              <CurrencySelect
                id="current_currency_code"
                name="current_currency_code"
                label="Client's Currency"
                formik={formik}
                onCurrencyChanged={(currency) => {
                  formik.setFieldValue("symbol", currency?.currencySymbol);
                }}
              />
            </Col>
            <Col>
              <CurrencySelect
                id="convert_currency_code"
                name="convert_currency_code"
                label="Convert Currency"
                formik={formik}
              />
            </Col>
          </Row>
        </FormGroup>

        <hr />

        {/* Employment Details Group */}
        <FormGroup className="d-flex align-content-between mt-3">
          <FormLabel>Category</FormLabel>
          <FormCheck
            className="ms-3"
            type="radio"
            label="Full-Time"
            name="category"
            id="categoryFullTime"
            value="FULL_TIME"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.category === "FULL_TIME"}
            isInvalid={
              formik.touched.category && Boolean(formik.errors.category)
            }
          />
          <FormCheck
            type="radio"
            label="Part-Time"
            name="category"
            id="categoryPartTime"
            value="PART_TIME"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.category === "PART_TIME"}
            isInvalid={
              formik.touched.category && Boolean(formik.errors.category)
            }
          />
          {formik.touched.category && (
            <div className="text-danger">{formik.errors.category}</div>
          )}
        </FormGroup>

        <FormGroup className="mt-3">
          <Row>
            <Col>
              <ColorPickerInput
                label="Banner Color"
                name="banner_color"
                value={formik.values.banner_color}
                onChange={(color) =>
                  formik.setFieldValue("banner_color", color)
                }
                error={
                  formik.touched.banner_color ? formik.errors.banner_color : ""
                }
              />
            </Col>
            <Col>
              <ColorPickerInput
                label="Headline Color"
                name="headline_color"
                value={formik.values.headline_color}
                onChange={(color) =>
                  formik.setFieldValue("headline_color", color)
                }
                error={
                  formik.touched.headline_color
                    ? formik.errors.headline_color
                    : ""
                }
              />
            </Col>
            <Col>
              <ColorPickerInput
                label="Text Color"
                name="text_color"
                value={formik.values.text_color}
                onChange={(color) => formik.setFieldValue("text_color", color)}
                error={
                  formik.touched.text_color ? formik.errors.text_color : ""
                }
              />
            </Col>
          </Row>
        </FormGroup>

        <Button type="submit" variant="success" className="mt-5 w-100">
          {isUpdate ? "Update Client" : "Add Client"}
        </Button>
      </Form>
    </Container>
  );
};

export default ClientForm;
