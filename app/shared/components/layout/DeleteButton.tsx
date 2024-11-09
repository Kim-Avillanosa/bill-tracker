import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

type DeleteButtonProps = {
  onDelete: () => void;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
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
        <ButtonGroup>
          <Button variant="outline-success" onClick={handleConfirm}>
            <FaCheck />
          </Button>
          <Button variant="outline-danger" onClick={handleCancel}>
            <FaTimes />
          </Button>
        </ButtonGroup>
      ) : (
        <Button variant="danger" onClick={handleDeleteClick}>
          <FaTrash />
        </Button>
      )}
    </div>
  );
};

export default DeleteButton;
