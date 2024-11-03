import React, { FC, useState } from "react";
import { FormGroup, FormLabel, FormControl, InputGroup } from "react-bootstrap";
import { SketchPicker, ColorResult } from "react-color";

type ColorPickerInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
};

const ColorPickerInput: FC<ColorPickerInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleColorChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  return (
    <FormGroup>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <InputGroup.Text
          style={{
            backgroundColor: value,
            width: "40px",
            cursor: "pointer",
          }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <FormControl
          type="text"
          name={name}
          placeholder="Enter color code"
          value={value}
          onChange={handleTextChange}
          isInvalid={Boolean(error)}
        />
        {error && <div className="text-danger">{error}</div>}
      </InputGroup>
      {showPicker && (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              zIndex: 1000,
            }}
          >
            <SketchPicker color={value} onChange={handleColorChange} />
          </div>
          <div
            onClick={() => setShowPicker(false)}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </FormGroup>
  );
};

export default ColorPickerInput;
