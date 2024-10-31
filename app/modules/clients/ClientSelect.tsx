import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import useClient from "@/services/useClient";
import { toast } from "react-hot-toast";

interface ClientSelectProps {
  onChange: (id: number) => void;
}

const ClientSelect: React.FC<ClientSelectProps> = ({ onChange }) => {
  const { getClientList } = useClient();
  const [clients, setClients] = useState<Models.Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getClientList();
        // Assuming response.data is an array of clients
        setClients(response.data); // Assuming response.data is already typed as Client[]
      } catch (error) {
        toast.error("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <Form.Group controlId="clientSelect">
      <Form.Label>Client</Form.Label>
      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <Form.Control
          as="select"
          onChange={(e) => onChange(Number(e.target.value))}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.code})
            </option>
          ))}
        </Form.Control>
      )}
    </Form.Group>
  );
};

export default ClientSelect;
