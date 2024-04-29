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
import { type CompleteIssue, type OneIssue } from '@interfaces/panel.ts';
import { formatDate } from '@utils/helper.ts';
import AppEditor from './AppEditor.tsx';
import Show from '@defaults/Show.tsx';
import useLoadIframe from '@panelHooks/issues/useLoadIframe.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';

interface IssueUpdatePanelProps {
	completeIssue: OneIssue;
	isLoading: boolean;
}

const IssueUpdatePanel: FC<IssueUpdatePanelProps> = ({
	completeIssue,
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

	const safelyIssue = (): CompleteIssue | Partial<CompleteIssue> =>
		completeIssue.issue
			? completeIssue.issue
			: {
					id: '',
					createdAt: '',
					riskScore: '0',
					resourceID: '1',
					content: '',
					cs: [],
					name: '',
				};
	useEffect(
		() =>
			dispatch((state: UpdateIssue) => ({
				...state,
				id: safelyIssue().id || '',
				issueName: safelyIssue().name || '',
				score: safelyIssue().riskScore || '',
				resourceID: Number(safelyIssue().resourceID || 1),
			})),
		[completeIssue],
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
						Published: <span>{formatDate(safelyIssue().createdAt!)}</span>
					</div>
					{updatedIssue.resourceID !== 1 ? (
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
						Author: <span>@{safelyIssue().researcherUsername}</span>
					</div>
					<div>
						Risk score: <span>{safelyIssue().riskLevel}</span>
					</div>
					<div>
						Resource: <span>{safelyIssue().riskLevel}</span>
					</div>
					<div>
						Status: <span>{safelyIssue().condition}</span>
					</div>
				</div>
				<div className="">
					<AppEditor
						isEditable={!isEditable}
						initialValue={safelyIssue().content || ''}
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
