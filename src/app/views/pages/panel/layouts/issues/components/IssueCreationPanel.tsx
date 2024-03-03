import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Issues, SaveIssue, useSaveIssue } from '../../../../../../data';
import { useTheme } from '../../../../../ThemeContext';
import {
	LeftArrow,
	PageLoaderOverlay,
	SaveIcon,
	Show,
} from '../../../../../components';
import AppEditor from './AppEditor';

interface IssueCreationPanelProps {
	issues: Issues[];
	isLoading: boolean;
}

const IssueCreationPanel: React.FC<IssueCreationPanelProps> = (props) => {
	const { newIssue, dispatch, save, shouldDisableClass, type, resourceId } =
		useSaveIssue();
	const [isEditable, setEditable] = useState(false);
	const navigate = useNavigate();
	const { theme } = useTheme();

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
				contentWindow = iframe.contentWindow! as WindowProxy;
				contentWindow.addEventListener('keydown', handleKeyDown);
				timeID = setTimeout(() => setEditable(true), 75);
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

	useEffect(() => {
		let contentWindow: Window | null;
		let themeTiny;

		const loadIframe = () => {
			const iframe = document.getElementById(
				'issue_ifr',
			) as HTMLIFrameElement | null;

			if (!iframe) {
				themeTiny = setTimeout(() => loadIframe(), 30);
			} else {
				contentWindow = iframe.contentWindow! as WindowProxy;
				const body = contentWindow.document;
				themeTiny = setTimeout(
					() => body.documentElement.setAttribute('data-theme', theme),
					25,
				);
			}
		};

		loadIframe();
		return () => {
			clearTimeout(themeTiny!);
		};
	}, [theme]);

	return (
		<>
			<div className="header">
				<div
					className="back"
					onClick={() => {
						type ? navigate(-1) : navigate('/issues');
					}}>
					<LeftArrow isButton />
				</div>
				<input
					className="w-[90%] h-full flex-1"
					placeholder="Add Issue title here..."
					name="issueName"
					value={newIssue.issueName}
					onChange={handleChange}
					autoFocus
				/>

				<div className="work-buttons">
					<div
						className={`save edit_btn ${isEditable ? 'on' : 'off'}`}
						onClick={() => handleIssueUpdate()}>
						<SaveIcon isButton />
					</div>
				</div>
			</div>

			<div className="info">
				{resourceId && (
					<div className="issue-detail-select">
						<p className="pr-2">Resource ID:</p>
						<span className="py-3 log-inputs">{resourceId}</span>
					</div>
				)}
				<div className="issue-detail-select">
					<p className="pr-2">Class:</p>
					<select
						onChange={handleChange}
						className={`py-3  focus:outline-none log-inputs ${
							shouldDisableClass && 'opacity-50'
						}`}
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
			<Show when={newIssue.isAddingIssue}>
				<PageLoaderOverlay />
			</Show>
		</>
	);
};

export default IssueCreationPanel;
