import React, { ChangeEvent, useState } from 'react';
import {
	LeftArrow,
	PageLoaderOverlay,
	PencilIcon,
	SaveIcon,
	Show,
} from '../../../../../components';
import { useNavigate } from 'react-router';
import { AppEditor } from './AppEditor';
import { Issues, SaveIssue, useSaveIssue } from '../../../../../../data';

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

	/*const handleKeyDown = useCallback(
		(event: any) => {
			if (event.ctrlKey && (event.key === 's' || event.keyCode === 83)) {
				event.preventDefault();
				handleIssueUpdate();
			}
		},
		[handleIssueUpdate],
	);
	useEffect(() => {
		const iframe = document.getElementById('issue_ifr') as HTMLIFrameElement;
		if (!iframe) return;
		const contentWindow = iframe.contentWindow;
		contentWindow!.addEventListener('keydown', handleKeyDown);

		return () => {
			contentWindow!.removeEventListener('keydown', handleKeyDown);
		};
	}, []);*/

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		dispatch((state: SaveIssue) => ({
			...state,
			[name]: value,
		}));
	};
	return (
		<>
			<div className="header">
				<div className="back" onClick={() => navigate('/issues')}>
					<LeftArrow />
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
				<div className="flex items-center">
					<p>Class:</p>
					<select
						onChange={handleChange}
						className="  py-3 bg-white focus:outline-none"
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

				<div className="flex items-center">
					<p>Risk score:</p>
					<select
						onChange={handleChange}
						className=" py-3 bg-whitefocus:outline-none "
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

			<div className="">
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
