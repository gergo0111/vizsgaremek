import { useState, useEffect } from "react";
import type { Munka } from "../../interfaces/Munka";
import type { Feladat } from "../../interfaces/Feladat";
import { apiPatch } from "../../lib/api";
import { Modal, Button, ProgressBar, ListGroup, Row, Col, Form } from "react-bootstrap";
import "./WorkDisplay.css";

interface WorkDisplayProps {
	work: Munka;
	onClose: () => void;
	onSave?: (updatedWork: Munka) => void;
}

export function WorkDisplay({ work, onClose, onSave }: WorkDisplayProps) {
	const [currentPage, setCurrentPage] = useState(0);
	const [tasks, setTasks] = useState<Feladat[]>(work.feladat || []);
	const [isSaving, setIsSaving] = useState(false);
	const TASKS_PER_PAGE = 5;

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((t) => t.isCompleted).length;
	const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

	const startIdx = currentPage * TASKS_PER_PAGE;
	const endIdx = startIdx + TASKS_PER_PAGE;
	const visibleTasks = tasks.slice(startIdx, endIdx);
	const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				handleClose();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	async function toggleTask(taskId: number) {
		const updatedTasks = tasks.map((t) =>
			t.feladat_id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
		);
		setTasks(updatedTasks);
	}

	async function handleSave() {
		setIsSaving(true);
		try {
			const savePromises = tasks.map((task) => {
				const originalTask = work.feladat?.find((f) => f.feladat_id === task.feladat_id);
				if (originalTask && task.isCompleted !== originalTask.isCompleted) {
					return apiPatch(`/feladatok/${task.feladat_id}`, {
						isCompleted: task.isCompleted,
					});
				}
				return Promise.resolve(null);
			});

			await Promise.all(savePromises);

			const updatedWork: Munka = {
				...work,
				feladat: tasks,
			};

			if (onSave) {
				onSave(updatedWork);
			}

			onClose();
		} catch (error) {
			console.error("Hiba az adatok mentésekor:", error);
		} finally {
			setIsSaving(false);
		}
	}

	function handleClose() {
		// Bez­árás gomb: elveti az összes módosítást
		setTasks(work.feladat || []);
		onClose();
	}

	function prevPage() {
		setCurrentPage((p) => Math.max(0, p - 1));
	}
	
	function nextPage() {
		setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
	}

	return (
		<Modal show onHide={handleClose} centered contentClassName="work-display-content">
			<Modal.Header closeButton>
				<Modal.Title className="wd-title">{work.munka_neve}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="wd-section">
					<h6 className="wd-subtitle">Előrehaladás:</h6>
					<ProgressBar now={progress} label={`${progress}%`} className="wd-progress" />
				</div>

				<div className="wd-section">
					<h6 className="wd-subtitle">Feladatok:</h6>
					<div className="wd-tasks">
						{totalTasks === 0 ? (
							<div className="wd-no-tasks">Nincs feladat</div>
						) : (
							<ListGroup variant="flush">
								{visibleTasks.map((task) => (
									<ListGroup.Item key={task.feladat_id} className="wd-taskItem">
										<Form.Check
											type="checkbox"
											id={`task-${task.feladat_id}`}
											label={task.leiras}
														checked={task.isCompleted}
														onChange={() => toggleTask(task.feladat_id)}
														disabled={work.isActive === false}
										/>
										{task.isCompleted && <span className="wd-done">✓</span>}
									</ListGroup.Item>
								))}
							</ListGroup>
						)}
					</div>
				</div>

				{totalPages > 1 && (
					<Row className="wd-pagination align-items-center mt-3 mb-2">
						<Col xs="auto">
							<Button variant="dark" size="sm" onClick={prevPage} disabled={currentPage === 0}>
								←
							</Button>
						</Col>
						<Col className="text-center">
							<strong className="wd-pageInfo">{currentPage + 1} / {totalPages}</strong>
						</Col>
						<Col xs="auto">
							<Button variant="dark" size="sm" onClick={nextPage} disabled={currentPage === totalPages - 1}>
								→
							</Button>
						</Col>
					</Row>
				)}

				<div className="wd-deadline d-flex align-items-center justify-content-between mt-3">
					<div className="wd-deadline-label">Határidő:</div>
					<div className="wd-deadline-date text-danger">{new Date(work.varhato_befejezes_datuma).toLocaleDateString("hu-HU")}</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>Mégsem</Button>
				<Button variant="primary" onClick={handleSave} disabled={isSaving || work.isActive === false}>
					{isSaving ? "Mentés..." : "Mentés"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default WorkDisplay;