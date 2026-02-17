import useInvoice from "@/services/useInvoice";
import useModalStore from "@/shared/store/useModal";
import { formatCurrency, roundCurrency, roundTo, toNumber } from "@/lib/currency";
import React, { useState, useMemo } from "react";
import {
	Form,
	Button,
	Table,
	Card,
	Container,
	Col,
	Row,
} from "react-bootstrap";
import toast from "react-hot-toast";

interface InvoiceItem {
	id: number;
	title: string;
	description: string;
	entryDate: string;
	amount: number | "";
	hours: number;
}

interface InvoiceEditFormProps {
	invoice: Models.Invoice;
	client: Models.Client;
	onSuccess: () => void;
}

const InvoiceEditForm: React.FC<InvoiceEditFormProps> = ({
	invoice,
	client,
	onSuccess,
}) => {
	const { updateInvoice } = useInvoice();
	const { dismiss } = useModalStore();
	const hourlyRate = toNumber(client.hourly_rate);

	const initialItems: InvoiceItem[] = useMemo(
		() =>
			invoice.workItems?.map((wi, idx) => {
				const hours = Number(wi.hours) || 0;
				const rate = toNumber(wi.rate) || hourlyRate;
				const amount = roundCurrency(hours * rate);
				const entryDate =
					typeof wi.entry_date === "string"
						? wi.entry_date.split("T")[0]
						: new Date(wi.entry_date).toISOString().split("T")[0];
				return {
					id: wi.id ?? idx + 1,
					title: wi.title,
					description: wi.description,
					entryDate,
					amount,
					hours,
				};
			}) ?? [],
		[invoice.workItems, hourlyRate]
	);

	const [note, setNote] = useState(invoice.note ?? "");
	const [date, setDate] = useState(
		typeof invoice.date === "string"
			? invoice.date.split("T")[0]
			: new Date(invoice.date).toISOString().split("T")[0]
	);
	const [items, setItems] = useState<InvoiceItem[]>(
		initialItems.length > 0
			? initialItems
			: [
					{
						id: Date.now(),
						title: "",
						description: "",
						entryDate: new Date().toISOString().split("T")[0],
						amount: "",
						hours: 0,
					},
			  ]
	);

	const workItemsPayload: Models.WorkItem[] = items.map((item) => ({
		entry_date: item.entryDate,
		title: item.title,
		description: item.description,
		tags: [item.description],
		hours: item.hours,
	}));

	const handleSubmit = () => {
		toast.promise(
			updateInvoice(invoice.id, {
				note,
				date: new Date(date).toISOString(),
				workItems: workItemsPayload,
			}).then(() => {
				dismiss();
				onSuccess();
			}),
			{
				loading: "Updating invoice...",
				success: "Invoice updated",
				error: "Failed to update invoice",
			}
		);
	};

	const updateItem = (
		id: number,
		field: keyof InvoiceItem,
		value: string | number | ""
	) => {
		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== id) return item;
				const updated = { ...item, [field]: value } as InvoiceItem;
				if (field === "amount") {
					const amt =
						typeof updated.amount === "number"
							? updated.amount
							: parseFloat(String(updated.amount)) || 0;
					updated.hours = hourlyRate > 0 ? roundTo(amt / hourlyRate, 4) : 0;
				}
				return updated;
			})
		);
	};

	const addItem = () =>
		setItems((prev) => [
			...prev,
			{
				id: Date.now(),
				title: "",
				description: "",
				entryDate: new Date().toISOString().split("T")[0],
				amount: "",
				hours: 0,
			},
		]);

	const removeItem = (id: number) =>
		setItems((prev) => prev.filter((i) => i.id !== id));

	const totalAmount = roundCurrency(
		items.reduce(
			(sum, item) => sum + (typeof item.amount === "number" ? item.amount : 0),
			0
		)
	);
	const totalHours = items.reduce((sum, item) => sum + item.hours, 0);

	return (
		<Container>
			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Note</Form.Label>
						<Form.Control
							as="textarea"
							rows={2}
							value={note}
							onChange={(e) => setNote(e.target.value)}
						/>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Date</Form.Label>
						<Form.Control
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card className="p-3 mb-3">
						<Card.Body>
							<Card.Title>
								<strong>Total Amount:</strong>{" "}
								{formatCurrency(totalAmount, {
									currencyCode: client.current_currency_code,
								})}
							</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="p-3 mb-3">
						<Card.Body>
							<Card.Title>
								<strong>Total Hours:</strong> {totalHours.toFixed(2)}
							</Card.Title>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col>
					<Button variant="light" className="mb-2 float-end" onClick={addItem}>
						➕ Add Item
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<Table responsive striped bordered>
						<thead>
							<tr>
								<th>Title</th>
								<th>Description</th>
								<th>Entry Date</th>
								<th>Amount</th>
								<th>Hours</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr key={item.id}>
									<td>
										<Form.Control
											type="text"
											value={item.title}
											onChange={(e) =>
												updateItem(item.id, "title", e.target.value)
											}
											placeholder="Title"
										/>
									</td>
									<td>
										<Form.Control
											as="textarea"
											rows={2}
											value={item.description}
											onChange={(e) =>
												updateItem(item.id, "description", e.target.value)
											}
											placeholder="Description"
										/>
									</td>
									<td>
										<Form.Control
											type="date"
											value={item.entryDate}
											onChange={(e) =>
												updateItem(item.id, "entryDate", e.target.value)
											}
										/>
									</td>
									<td>
										<Form.Control
											type="number"
											value={item.amount}
											onChange={(e) =>
												updateItem(
													item.id,
													"amount",
													e.target.value === ""
														? ""
														: parseFloat(e.target.value)
												)
											}
											placeholder="Amount"
											min={0}
										/>
									</td>
									<td>{roundTo(item.hours, 2).toFixed(2)}</td>
									<td>
										<Button
											variant="danger"
											size="sm"
											onClick={() => removeItem(item.id)}
										>
											Remove
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
			<Row>
				<Col>
					<Button
						variant="success"
						className="mt-3 float-end"
						onClick={handleSubmit}
					>
						Save changes
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default InvoiceEditForm;
