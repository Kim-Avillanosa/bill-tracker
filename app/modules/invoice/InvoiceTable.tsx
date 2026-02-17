import useInvoice from "@/services/useInvoice";
import useAuthStore from "@/shared/store/useAuthStore";
import useModalStore from "@/shared/store/useModal";
import React, { useCallback, useEffect, useState } from "react";
import {
	Table,
	Container,
	Button,
	Spinner,
	Alert,
	Badge,
} from "react-bootstrap";
import DeleteButton from "@/shared/components/layout/DeleteButton";
import InvoiceEditForm from "./InvoiceEditForm";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";

const InvoiceTable: React.FC = () => {
	const { fetchInvoices, fetchInvoiceById, deleteInvoice } = useInvoice();
	const { currentAccount } = useAuthStore();
	const { openModal } = useModalStore();
	const [invoices, setInvoices] = useState<Models.Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadInvoices = useCallback(async () => {
		if (!currentAccount?.id) return;
		setLoading(true);
		setError(null);
		try {
			const response = await fetchInvoices(currentAccount.id);
			setInvoices(response.data ?? []);
		} catch {
			setError("Failed to load invoices.");
		} finally {
			setLoading(false);
		}
	}, [currentAccount?.id, fetchInvoices]);

	useEffect(() => {
		loadInvoices();
	}, [loadInvoices]);

	const handleDelete = async (id: number) => {
		try {
			await deleteInvoice(id);
			toast.success("Invoice deleted");
			loadInvoices();
		} catch {
			toast.error("Failed to delete invoice");
		}
	};

	const handleEdit = async (invoice: Models.Invoice) => {
		try {
			const response = await fetchInvoiceById(invoice.id);
			const fullInvoice = response.data;
			if (!fullInvoice?.client) return;
			openModal({
				size: "xl",
				title: `Edit invoice ${fullInvoice.invoiceNumber}`,
				content: (
					<InvoiceEditForm
						invoice={fullInvoice}
						client={fullInvoice.client}
						onSuccess={loadInvoices}
					/>
				),
			});
		} catch {
			toast.error("Failed to load invoice details");
		}
	};

	const getStatusVariant = (status: string) => {
		switch (status?.toLowerCase()) {
			case "received":
				return "success";
			case "released":
				return "primary";
			case "pending":
				return "warning";
			default:
				return "secondary";
		}
	};

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
			<Container className="mt-5">
				<Alert variant="danger">{error}</Alert>
			</Container>
		);
	}

	return (
		<Container className="mt-5">
			<Table bordered hover responsive>
				<thead>
					<tr>
						<th>Invoice #</th>
						<th>Client</th>
						<th>Date</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{invoices.length === 0 ? (
						<tr>
							<td colSpan={5} className="text-center text-muted">
								No invoices yet.
							</td>
						</tr>
					) : (
						invoices.map((invoice) => (
							<tr key={invoice.id}>
								<td>{invoice.invoiceNumber}</td>
								<td>
									{invoice.client?.name ?? ""}{" "}
									{invoice.client?.code ? `(${invoice.client.code})` : ""}
								</td>
								<td>
									{new Date(invoice.date).toLocaleDateString()}
								</td>
								<td>
									<Badge bg={getStatusVariant(invoice.status)}>
										{invoice.status?.toUpperCase() ?? "—"}
									</Badge>
								</td>
								<td>
									<div className="d-flex gap-1">
										<Button
											variant="outline-dark"
											size="sm"
											onClick={() => handleEdit(invoice)}
										>
											<FaPencil />
										</Button>
										<DeleteButton
											onDelete={() => handleDelete(invoice.id)}
										/>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>
		</Container>
	);
};

export default InvoiceTable;
