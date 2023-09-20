import { useEffect, useRef } from "react";
import ReactPortal from "./ReactPortal";

function Modal({ children, isOpen, handleClose }) {
	const nodeRef = useRef(null);
	useEffect(() => {
		const closeOnEscapeKey = (e) =>
			e.key === "Escape" ? handleClose() : null;
		document.body.addEventListener("keydown", closeOnEscapeKey);
		return () => {
			document.body.removeEventListener("keydown", closeOnEscapeKey);
		};
	}, [handleClose]);

	useEffect(() => {
		const useOutsideClick = (e) =>
			nodeRef?.current?.contains && !nodeRef.current.contains(e.target)
				? handleClose()
				: null;
		document.body.addEventListener("mouseup", useOutsideClick);
		return () => {
			document.body.removeEventListener("mouseup", useOutsideClick);
		};
	}, [handleClose, nodeRef]);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<ReactPortal wrapperId="react-portal-modal-container">
			<>
				<div className="fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50" />
				<div
					ref={nodeRef}
					className="fixed rounded flex flex-col box-border min-w-fit overflow-hidden p-5 bg-white inset-y-32 inset-x-48 "
				>
					<button
						onClick={handleClose}
						className="py-2 px-8 self-end font-bold border rounded"
					>
						Close
					</button>
					<div className="box-border h-5/6">{children}</div>
				</div>
			</>
		</ReactPortal>
	);
}
export default Modal;
