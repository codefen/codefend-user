import React, { ChangeEvent, useEffect, useState } from 'react';
import {
	LeftArrow,
	PageLoaderOverlay,
	PencilIcon,
	SaveIcon,
	Show,
} from '../../../../../components';
import { useNavigate } from 'react-router';
import AppEditor from './AppEditor';
import { Issues, SaveIssue, useSaveIssue } from '../../../../../../data';
import { useTheme } from '../../../../../ThemeContext';

interface IssueCreationPanelProps {
	issues: Issues[];
	isLoading: boolean;
}

const IssueCreationPanel: React.FC<IssueCreationPanelProps> = (props) => {
	const { newIssue, dispatch, save } = useSaveIssue();
	const [isEditable, setEditable] = useState(false);
	const navigate = useNavigate();

	const handleIssueUpdate = () => {
		if (!isEditable) return;
		save().then((response: any) => {
			if (response !== undefined && response.id !== undefined) {
				navigate(`/issues/update/${response.id}`);
			}
		});
	};

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		dispatch((state: SaveIssue) => ({
			...state,
			[name]: value,
		}));
	};

	const handleKeyDown = (event: any) => {
		if (event.ctrlKey && (event.key === 's' || event.keyCode === 83)) {
			event.preventDefault();
			handleIssueUpdate();
		}
	};
	const { theme } = useTheme();
	useEffect(() => {
		let contentWindow: Window | null;
		let timeID;

		const loadIframe = () => {
			const iframe = document.getElementById(
				'issue_ifr',
			) as HTMLIFrameElement | null;
			if (!iframe) {
				timeID = setTimeout(() => loadIframe(), 30);
			} else {
				contentWindow = iframe.contentWindow!;
				contentWindow.document.body.setAttribute('data-theme', theme);
				contentWindow.addEventListener('keydown', handleKeyDown);
				timeID = setTimeout(() => setEditable((prev: boolean) => true), 30);
			}
		};

		loadIframe();

		return () => {
			if (contentWindow) {
				contentWindow.removeEventListener('keydown', handleKeyDown);
			}
			clearTimeout(timeID!);
		};
	}, [props.isLoading, handleKeyDown]);

	return (
		<>
			<div className="header">
				<div className="back" onClick={() => navigate('/issues')}>
					<LeftArrow isButton />
				</div>
				<input
					className="w-[90%] h-full flex-1"
					placeholder="Add Issue title here..."
					name="issueName"
					value={newIssue.issueName}
					onChange={handleChange}
				/>

				<div className="flex !p-0">
					<div
						className={`save edit_btn ${isEditable ? 'on' : 'off'}`}
						onClick={() => handleIssueUpdate()}>
						<SaveIcon isButton />
					</div>
				</div>
			</div>

			<div className="info">
				<div className="issue-detail-select">
					<p className="pr-2">Class:</p>
					<select
						onChange={handleChange}
						className="  py-3  focus:outline-none log-inputs"
						value={newIssue.issueClass}
						name="issueClass"
						required>
						<option value="" disabled>
							Select Class
						</option>
						<option value="web">web</option>
						<option value="mobile">mobile</option>
						<option value="cloud">cloud</option>
						<option value="lan">internal network</option>
						<option value="source">source code</option>
						<option value="social">social & osint</option>
						<option value="research">research</option>
					</select>
				</div>

				<div className="issue-detail-select">
					<p className="pr-2">Risk score:</p>
					<select
						onChange={handleChange}
						className=" py-3 focus:outline-none log-inputs"
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
			<Show when={newIssue.isAddingIssue}>
				<PageLoaderOverlay />
			</Show>
		</>
	);
};

export default IssueCreationPanel;
