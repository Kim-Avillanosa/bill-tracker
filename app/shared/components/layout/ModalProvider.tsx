import useModalStore from "@/shared/store/useModal";
import { Modal } from "react-bootstrap";

const ModalProvider: React.FC = () => {
  const { size, properties, isOpen, dismiss } = useModalStore();

  if (!properties) return <></>;

  return (
    <Modal size={size} backdrop="static" show={isOpen} onHide={dismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{properties?.title ?? ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{properties?.content ?? ""}</Modal.Body>
    </Modal>
  );
};

export default ModalProvider;
