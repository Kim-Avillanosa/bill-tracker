import useClient from "@/services/useClient";
import useModalStore from "@/shared/store/useModal";
import React, { useEffect, useState } from "react";
import { Table, Container, Button, Spinner, Alert } from "react-bootstrap";
import ClientForm from "./ClientForm";
import DeleteButton from "@/shared/components/layout/DeleteButton";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";

const ClientTable: React.FC = () => {
  const { getClientList, deleteClient } = useClient();
  const [clients, setClients] = useState<Models.Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, openModal } = useModalStore();

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClient(id);
      toast.success("Client deleted successfully");
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await getClientList();
      setClients(response.data);
      setLoading(false);
    } catch {
      setError("Failed to load clients.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [isOpen]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Button
        className="float-end mb-3"
        variant="outline-dark"
        onClick={() => {
          openModal({
            size: "lg",
            title: "Add new client",
            content: <ClientForm />,
          });
        }}
      >
        ➕ Add new client
      </Button>
      <Table className="mt-3" bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Symbol</th>
            <th>Address</th>
            <th>Hourly Rate</th>
            <th>Hours per Day</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.code}>
              <td>{client.name}</td>
              <td>{client.code}</td>
              <td>{client.symbol}</td>
              <td>{client.address}</td>
              <td>{`${client.symbol} ${client.hourly_rate}`}</td>
              <td>{client.hours_per_day}</td>
              <td>{client.category}</td>
              <td>
                <div className="d-flex gap-1 float-end">
                  <Button
                    onClick={() => {
                      openModal({
                        size: "lg",
                        title: "Update client information",
                        content: (
                          <ClientForm initialData={client} isUpdate={true} />
                        ),
                      });
                    }}
                    variant="outline-dark"
                  >
                    <FaPencil />
                  </Button>
                  <DeleteButton
                    onDelete={() => {
                      if (client.id) {
                        handleDeleteClient(client.id);
                      }
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ClientTable;
