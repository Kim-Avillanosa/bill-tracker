import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Spinner,
} from "react-bootstrap";
import useTimesheets from "@/services/useTimesheets";
import TagInput from "@/shared/components/layout/TagInput";
import { safeJsonParse } from "@/lib/safeJsonParse";

interface TimesheetFormProps {
  clientId: number;
  timesheet?: Models.Timesheet;
  onSuccess?: () => void;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  clientId,
  timesheet,
  onSuccess,
}) => {
  const { addTimesheet, updateTimesheet } = useTimesheets();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      summary: timesheet?.summary || "",
      entryDate: timesheet?.entry_date
        ? new Date(timesheet?.entry_date).toDateString() // Format to YYYY-MM-DD
        : new Date().toDateString(), // Use current date in YYYY-MM-DD format
      tags: safeJsonParse<string[]>(timesheet?.tags ?? "") || [], // Initialize tags as an empty array
    },
    validationSchema: Yup.object({
      summary: Yup.string().required("Summary is required"),
      entryDate: Yup.date().required("Entry date is required"),
      tags: Yup.array().of(Yup.string()), // Define tags as an array of strings
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          summary: values.summary,
          entry_date: new Date(values.entryDate).toISOString(), // Ensure entry_date is in UTC format
          tags: values.tags, // Pass tags as an array
        };

        if (timesheet) {
          await updateTimesheet(timesheet.id, payload);
        } else {
          await addTimesheet(clientId, payload);
        }

        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to submit timesheet data", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const loadTimesheetData = async () => {
    if (!timesheet) return;
    setLoading(true);
    try {
      if (timesheet) {
        formik.setValues({
          summary: timesheet.summary,
          entryDate: timesheet.entry_date.split("T")[0],
          tags: safeJsonParse<string[]>(timesheet.tags) || [], // Set tags as an array
        });
      }
    } catch (error) {
      console.error("Error loading timesheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimesheetData();
  }, []); // Depend on timesheet to reload data when it changes

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className="p-4 bg-white rounded shadow-md"
    >
      <FormGroup className="mb-3">
        <FormLabel>Summary</FormLabel>
        <FormControl
          as="textarea"
          rows={4}
          {...formik.getFieldProps("summary")}
          isInvalid={formik.touched.summary && !!formik.errors.summary}
        />
        {formik.touched.summary && formik.errors.summary && (
          <div className="text-danger">{formik.errors.summary}</div>
        )}
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>Entry Date</FormLabel>
        <FormControl
          type="date"
          {...formik.getFieldProps("entryDate")}
          isInvalid={formik.touched.entryDate && !!formik.errors.entryDate}
        />
        {formik.touched.entryDate && formik.errors.entryDate && (
          <div className="text-danger">{formik.errors.entryDate}</div>
        )}
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>Tags</FormLabel>
        <TagInput
          tags={formik.values.tags} // Pass the current tags as a prop
          onChange={(tags) => {
            formik.setFieldValue("tags", tags); // Update the tags using setFieldValue
          }}
        />
        {formik.touched.tags && formik.errors.tags && (
          <div className="text-danger">
            {Array.isArray(formik.errors.tags)
              ? formik.errors.tags.join(", ") // Join if it's an array
              : formik.errors.tags}
          </div>
        )}
      </FormGroup>
      <Button
        variant="success"
        type="submit"
        disabled={loading}
        className="w-100" // This class makes the button full-width
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Saving...
          </>
        ) : timesheet ? (
          "Update Timesheet"
        ) : (
          "Add Timesheet"
        )}
      </Button>
    </Form>
  );
};

export default TimesheetForm;
