import useModalStore from "@/shared/store/useModal";
import { Modal } from "react-bootstrap";

const ModalProvider: React.FC = () => {
  const { fullscreen, size, properties, isOpen, dismiss } = useModalStore();

  if (!properties) return <></>;

  return (
    <Modal
      size={size}
      backdrop="static"
      show={isOpen}
      onHide={dismiss}
      fullscreen={properties.fullscreen}
    >
      <Modal.Header closeButton>
        <Modal.Title>{properties?.title ?? ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-5">
        {JSON.stringify(fullscreen)}

        {properties?.content ?? ""}
      </Modal.Body>
    </Modal>
  );
};

export default ModalProvider;
