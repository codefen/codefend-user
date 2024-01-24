import React, { useCallback, useEffect, useState } from 'react';
import {
	LeftArrow,
	PageLoader,
	PageLoaderOverlay,
	PencilIcon,
	SaveIcon,
	Show,
} from '../../../../../components';
import { useNavigate } from 'react-router';
import { AppEditor } from './AppEditor';
import {
	CompleteIssue,
	OneIssue,
	UpdateIssue,
	useUpdateIssue,
} from '../../../../../../data';

interface IssueUpdatePanelProps {
	completeIssue: OneIssue;
	isLoading: boolean;
}

const IssueUpdatePanel: React.FC<IssueUpdatePanelProps> = ({
	completeIssue,
	isLoading,
}) => {
	const safelyIssue = (): any => {
		const result =
			completeIssue.issue !== undefined && completeIssue.issue !== null
				? completeIssue.issue
				: { id: '', riskScore: '0', content: '', cs: [], name: '' };
		return result;
	};

	const navigate = useNavigate();
	const { updatedIssue, dispatch, update } = useUpdateIssue();
	const [issueNameUpdate, setIssueNameUpdate] = useState(safelyIssue().name);
	const [isEditable, setEditable] = useState(false);

	const handleIssueUpdate = useCallback(() => {
		update()
			.then((response: any) => {
				console.log({ v2: response });
				setEditable(false);
			})
			.finally(() => {
				navigate(`/issues`);
			});
	}, [safelyIssue, update]);

	const handleKeyDown = (event: any) => {
		if (event.ctrlKey && (event.key === 's' || event.keyCode === 83)) {
			event.preventDefault();
			handleIssueUpdate();
		}
	};
	useEffect(() => {
		const iframe = document.getElementById('issue_ifr') as HTMLIFrameElement;
		if (!iframe) return;

		const contentWindow = iframe.contentWindow;
		contentWindow!.addEventListener('keydown', handleKeyDown);
		setEditable(!isEditable);

		return () => {
			contentWindow!.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(
		() =>
			dispatch((state: UpdateIssue) => ({
				...state,
				id: safelyIssue().id,
				issueName: safelyIssue().name,
				score: safelyIssue().riskScore,
			})),
		[safelyIssue()],
	);

	return (
		<Show when={!isLoading} fallback={<PageLoader />}>
			<>
				<div className="header">
					<div className="back" onClick={() => navigate('/issues')}>
						<LeftArrow />
					</div>
					<Show
						when={isEditable}
						fallback={
							<div className="name flex-1">{updatedIssue.issueName}</div>
						}>
						<input
							type="text"
							className="flex-1"
							value={updatedIssue.issueName}
							onChange={(e) =>
								dispatch((state: UpdateIssue) => ({
									...state,
									issueName: e.target.value,
								}))
							}
						/>
					</Show>
					<div className="flex !p-0">
						<div
							className={`edit edit_btn  ${isEditable ? 'on' : 'off'}`}
							onClick={() => setEditable(!isEditable)}>
							<PencilIcon isButton />
						</div>
						<div
							className={`save edit_btn ${isEditable ? 'on' : 'off'}`}
							onClick={() => handleIssueUpdate()}>
							<SaveIcon isButton />
						</div>
					</div>
				</div>
				<div className="info">
					<div>
						Id: <span>{safelyIssue().id}</span>
					</div>
					<div>
						Class: <span>{safelyIssue().resourceClass}</span>
					</div>
					<div>
						Resource id: <span>{safelyIssue().researcherID}</span>
					</div>
					<div>
						Published: <span>{safelyIssue().createdAt}</span>
					</div>
					<div>
						Author: <span>{safelyIssue().researcherUsername}</span>
					</div>
					<div>
						Risk score: <span>{safelyIssue().riskScore}</span>
					</div>
					<div>
						status: <span>{safelyIssue().condition}</span>
					</div>
				</div>
				<div className="">
					<AppEditor
						isEditable={isEditable}
						initialValue={safelyIssue().content ?? ''}
						isIssueCreation={updatedIssue.isAddingIssue}
					/>
				</div>
				<Show when={updatedIssue.isAddingIssue}>
					<PageLoaderOverlay />
				</Show>
			</>
		</Show>
	);
};

export default IssueUpdatePanel;
