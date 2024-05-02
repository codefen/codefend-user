import { type FC, type ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams, type NavigateFunction } from 'react-router';
import { type SaveIssue, useSaveIssue } from '../../../../../../data';
import {
	LeftArrowIcon,
	PageLoader,
	PageLoaderOverlay,
	SaveIcon,
	Show,
} from '../../../../../components';
import AppEditor from './AppEditor';
import useLoadIframe from '@panelHooks/issues/useLoadIframe';
import useTimeout from '#commonHooks/useTimeout';

interface IssueCreationPanelProps {
	isLoading: boolean;
}

const IssueCreationPanel: FC<IssueCreationPanelProps> = (props) => {
	const navigate = useNavigate();
	const { type, resourceId } = useParams();

	const handleIssueUpdate = (
		isEditable: boolean,
		callBack: () => Promise<any>,
	) => {
		if (!isEditable) return;

		callBack().then((response: any) => {
			if (response !== undefined && response.id !== undefined) {
				navigate(`/issues/update/${response.id}`);
			}
		});
	};
	const { newIssue, isAddingIssue, dispatch, save } = useSaveIssue();
	const [isEditable, setEditable] = useState(false);
	const [isLoaded] = useLoadIframe(() => handleIssueUpdate(isEditable, save));
	const { oneExecute, clear } = useTimeout(() => setEditable(true), 75);

	useEffect(() => {
		const isValidID = !isNaN(Number(resourceId)) && Number(resourceId) !== 0;
		dispatch((state) => ({
			...state,
			issueClass: [
				'web',
				'mobile',
				'cloud',
				'lan',
				'source',
				'social',
				'research',
			].includes(type || '')
				? (type as string)
				: '',
			resourceID: isValidID ? Number(resourceId) : 0,
		}));
		if (isLoaded) oneExecute();
		return () => {
			clear();
			dispatch(() => ({
				issueName: '',
				score: '',
				issueClass: '',
				resourceID: 0,
			}));
		};
	}, [isLoaded]);
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;

		dispatch((state: SaveIssue) => ({
			...state,
			[name]: value,
		}));
	};
	const shouldDisableClass = type !== '' && newIssue.issueClass !== '';
	return (
		<>
			<div className="header">
				<div
					className="back"
					onClick={() => {
						type ? navigate(-1) : navigate('/issues');
					}}>
					<LeftArrowIcon isButton />
				</div>
				<input
					className="add-issues"
					placeholder="Add Issue title here..."
					name="issueName"
					value={newIssue.issueName}
					onChange={handleChange}
					autoFocus
				/>

				<div className="work-buttons">
					<div
						className={`save action-btn ${isEditable ? 'on' : 'off'}`}
						onClick={() => handleIssueUpdate(isEditable, save)}>
						<SaveIcon isButton />
					</div>
				</div>
			</div>

			<div className="info">
				{newIssue.resourceID && newIssue.resourceID !== 0 ? (
					<div className="info-resourcer-id">
						Resource ID: <span>{newIssue.resourceID}</span>
					</div>
				) : null}
				<div className="issue-detail-select">
					Class:
					<select
						onChange={handleChange}
						className={`log-inputs ${shouldDisableClass && 'opacity-50'}`}
						value={newIssue.issueClass}
						name="issueClass"
						required
						disabled={shouldDisableClass}>
						<option value="" disabled hidden>
							Select Class
						</option>
						<option value="web">web</option>
						<option value="mobile">mobile</option>
						<option value="cloud">cloud</option>
						<option value="social">social & osint</option>
						<option value="source">source code</option>
						<option value="lan">network</option>
						<option value="research">research</option>
					</select>
				</div>

				<div className="issue-detail-select">
					Risk score:
					<select
						onChange={handleChange}
						className="py-3  focus:outline-none log-inputs"
						defaultValue={newIssue?.score || ''}
						name="score"
						required>
						<option value="" disabled hidden>
							Select Score
						</option>
						<option value="5">critical</option>
						<option value="4">elevated</option>
						<option value="3">medium</option>
						<option value="2">low</option>
						<option value="1">intel</option>
					</select>
				</div>
			</div>

			<div>
				<AppEditor
					initialValue={'<p>Please add issues here...</p>'}
					isEditable={isEditable}
					isCreation={true}
				/>
			</div>
			<Show when={isAddingIssue}>
				<PageLoaderOverlay />
			</Show>
		</>
	);
};

export default IssueCreationPanel;
