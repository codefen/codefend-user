import { type FC, type ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { type SaveIssue, useSaveIssue } from '../../../../../../data';
import {
	LeftArrowIcon,
	PageLoaderOverlay,
	SaveIcon,
	Show,
} from '../../../../../components';
import AppEditor from './AppEditor';
import useLoadIframe from '@panelHooks/issues/useLoadIframe';

interface IssueCreationPanelProps {
	isLoading: boolean;
}

const IssueCreationPanel: FC<IssueCreationPanelProps> = (props) => {
	const navigate = useNavigate();
	const { newIssue, isAddingIssue, dispatch, save, shouldDisableClass, type } =
		useSaveIssue();
	const [isEditable, setEditable] = useState(false);
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
	const [isLoaded] = useLoadIframe(() => handleIssueUpdate(isEditable, save));
	useEffect(() => {
		let timeID;
		if (isLoaded) {
			timeID = setTimeout(() => setEditable(true), 75);
		}
		return () => clearTimeout(timeID!);
	}, [isLoaded]);
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		if (name == 'resourceID' && (!value || isNaN(Number(value)))) return;

		dispatch((state: SaveIssue) => ({
			...state,
			[name]: name == 'resourceID' ? value.replace(/[^0-9]/g, '') : value,
		}));
	};

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
						className={`save edit_btn ${isEditable ? 'on' : 'off'}`}
						onClick={() => handleIssueUpdate(isEditable, save)}>
						<SaveIcon isButton />
					</div>
				</div>
			</div>

			<div className="info">
				{newIssue.resourceID ? (
					<div className="issue-detail-select select-resource">
						<label>Resource ID:</label>
						<input
							className="log-inputs"
							type="number"
							value={newIssue.resourceID}
							name="resourceID"
							onChange={handleChange}
							pattern="\d*"
						/>
					</div>
				) : null}
				<div className="issue-detail-select">
					<p className="pr-2">Class:</p>
					<select
						onChange={handleChange}
						className={`log-inputs ${shouldDisableClass && 'opacity-50'}`}
						value={newIssue.issueClass}
						name="issueClass"
						required
						disabled={shouldDisableClass}>
						<option value="" disabled>
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
					<p className="pr-2">Risk score:</p>
					<select
						onChange={handleChange}
						className="py-3  focus:outline-none log-inputs"
						value={newIssue.score}
						name="score"
						required>
						<option value="" disabled>
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
					initialValue={''}
					isEditable={isEditable}
					isIssueCreation
				/>
			</div>
			<Show when={isAddingIssue}>
				<PageLoaderOverlay />
			</Show>
		</>
	);
};

export default IssueCreationPanel;
