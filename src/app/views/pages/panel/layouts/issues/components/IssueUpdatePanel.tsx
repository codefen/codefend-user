import {
	type FC,
	useCallback,
	useEffect,
	useState,
	type ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router';
import { PageLoader, PageLoaderOverlay } from '@defaults/loaders/Loader.tsx';
import { PencilIcon, SaveIcon, LeftArrowIcon } from '@icons';
import {
	type UpdateIssue,
	useUpdateIssue,
} from '@panelHooks/issues/useUpdateIssue.ts';
import { formatDate } from '@utils/helper.ts';
import AppEditor from './AppEditor.tsx';
import Show from '@defaults/Show.tsx';
import useLoadIframe from '@panelHooks/issues/useLoadIframe.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import type { IssueUpdateData } from '@interfaces/issues.ts';

interface IssueUpdatePanelProps {
	issueData: IssueUpdateData;
	isLoading: boolean;
}

const IssueUpdatePanel: FC<IssueUpdatePanelProps> = ({
	issueData,
	isLoading,
}) => {
	const navigate = useNavigate();
	const [isEditable, setEditable] = useState(true);
	const { updatedIssue, isAddingIssue, dispatch, update } = useUpdateIssue();
	const { isAdmin, isProvider } = useUserRole();
	const handleIssueUpdate = useCallback(() => {
		update()
			.then((response: any) => {
				setEditable(false);
			})
			.finally(() => {
				navigate(`/issues`);
			});
	}, [update]);
	const [isLoaded] = useLoadIframe(handleIssueUpdate);

	useEffect(
		() =>
			dispatch((state: UpdateIssue) => ({
				...state,
				id: issueData.id,
				issueName: issueData.name || '',
				score: issueData.risk_score || '',
				resourceID: Number(issueData.resource_id || 1),
				status: issueData.condicion,
			})),
		[issueData],
	);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		if (name == 'resourceID' && (!value || isNaN(Number(value)))) return;

		dispatch((state) => ({
			...state,
			[name]: name == 'resourceID' ? value.replace(/[^0-9]/g, '') : value,
		}));
	};

	return (
		<Show when={!isLoading} fallback={<PageLoader />}>
			<>
				<div className="header">
					<div className="back" onClick={() => navigate('/issues')}>
						<LeftArrowIcon isButton />
					</div>
					<Show
						when={!isEditable}
						fallback={
							<div className="name">{updatedIssue.issueName}</div>
						}>
						<input
							type="text"
							className="grow"
							value={updatedIssue.issueName}
							name="issueName"
							onChange={handleChange}
						/>
					</Show>
					{isAdmin() || isProvider() ? (
						<div className="work-buttons">
							<div
								className={`edit action-btn  ${!isEditable ? 'on' : 'off'}`}
								onClick={() => setEditable(!isEditable)}>
								<PencilIcon isButton />
							</div>
							<div
								className={`save action-btn ${!isEditable ? 'on' : 'off'}`}
								onClick={() => handleIssueUpdate()}>
								<SaveIcon isButton />
							</div>
						</div>
					) : null}
				</div>
				<div className="info">
					<div>
						Published: <span>{formatDate(issueData.creacion)}</span>
					</div>
					{updatedIssue.resourceID !== 1 &&
					updatedIssue.resourceID !== 0 ? (
						<div className="info-resourcer-id">
							Resource ID:{' '}
							<input
								type="number"
								className={`${isEditable && 'off'}`}
								value={updatedIssue.resourceID}
								disabled={isEditable}
								name="resourceID"
								onChange={handleChange}
								step="1"
								inputMode="numeric"
								pattern="\d*"
							/>
						</div>
					) : null}

					<div>
						Author: <span>@{issueData.researcher_username}</span>
					</div>
					<div>
						Resource: <span>{issueData.resource_class}</span>
					</div>
					<div>
						Risk: <span>{issueData.risk_level}</span>
					</div>
					<div>
						Status:
						<select
							onChange={(e: any) =>
								dispatch((state) => ({
									...state,
									status: e.target.value,
								}))
							}
							className={`log-inputs`}
							defaultValue={issueData.condicion}
							name="status"
							required
							disabled={isEditable}>
							<option value="open">open</option>
							<option value="fixed">fixed</option>
							<option value="verified">verified</option>
						</select>
					</div>
				</div>
				<div className="">
					<AppEditor
						isEditable={!isEditable}
						initialValue={issueData.issue}
						isIssueCreation={isAddingIssue}
					/>
				</div>
				<Show when={isAddingIssue}>
					<PageLoaderOverlay />
				</Show>
			</>
		</Show>
	);
};

export default IssueUpdatePanel;
