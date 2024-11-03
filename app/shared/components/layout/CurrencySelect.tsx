import React from "react";
import { FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { FormikProps } from "formik";
import { currencies } from "@/shared/constants/currencies";
import { ClientFormType } from "@/modules/clients/ClientForm";

interface CurrencySelectProps {
  label: string;
  id: keyof ClientFormType; // Add id prop
  name: keyof ClientFormType; // Add name prop
  formik: FormikProps<ClientFormType>; // Specify the type for form values
  onCurrencyChanged?: (currency: Models.Currency | undefined) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  formik,
  label,
  id,
  name,
  onCurrencyChanged,
}) => {
  return (
    <FormGroup>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <FormControl
        as="select"
        name={name}
        id={id}
        onChange={(e) => {
          formik.setFieldValue(name, e.target.value);

          const currentSymbol = currencies.find(
            (x) => x.symbol === e.target.value
          );
          if (currentSymbol && onCurrencyChanged) {
            onCurrencyChanged(currentSymbol);
          }
        }}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        isInvalid={formik.touched[name] && Boolean(formik.errors[name])}
      >
        <option value="">Select currency</option>
        {currencies.map((currency, idx) => (
          <option key={idx} value={currency.symbol}>
            {`${currency.name} (${currency.symbol})`}
          </option>
        ))}
      </FormControl>
      {formik.touched[name] && ( // Display error message based on touched and error state
        <div className="text-danger">{formik.errors[name]}</div>
      )}
    </FormGroup>
  );
};

export default CurrencySelect;
