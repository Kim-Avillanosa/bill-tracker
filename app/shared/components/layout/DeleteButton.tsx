import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

type DeleteButtonProps = {
  onDelete: () => void;
  label?: string;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  label = "Delete",
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    onDelete();
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <div>
      {isConfirming ? (
        <ButtonGroup className="m-1" size="sm">
          <Button variant="outline-success" onClick={handleConfirm}>
            <FaCheck />
          </Button>
          <Button variant="outline-danger" onClick={handleCancel}>
            <FaTimes />
          </Button>
        </ButtonGroup>
      ) : (
        <Button
          size="sm"
          variant="outline-danger"
          className="m-1"
          onClick={handleDeleteClick}
        >
          {label}
        </Button>
      )}
    </div>
  );
};

export default DeleteButton;
