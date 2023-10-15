import React from "react";
import Modal from "@/components/Modal";

export default function Dialog({
	isOpen,
	handleClose,
	modalId,
	handleConfirm,
	title,
	message,
}) {
	console.log("Dialog component rendered");
	return (
		<Modal isOpen={isOpen} handleClose={handleClose} modalId={modalId}>
			<div className="flex h-full w-full">
				<h1>{title}</h1>
				<p>{message}</p>
				<button onClick={() => console.log("NO")}>No</button>
				<button onClick={() => console.log("YES")}>Yes</button>
			</div>
		</Modal>
	);
}
