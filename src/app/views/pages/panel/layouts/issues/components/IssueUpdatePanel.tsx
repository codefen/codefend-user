import { type FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
	LeftArrow,
	PageLoader,
	PageLoaderOverlay,
	PencilIcon,
	SaveIcon,
	Show,
} from '../../../../../components';
import AppEditor from './AppEditor';
import {
	type OneIssue,
	type UpdateIssue,
	formatDate,
	useUpdateIssue,
} from '../../../../../../data';
import { useTheme } from '../../../../../ThemeContext';

interface IssueUpdatePanelProps {
	completeIssue: OneIssue;
	isLoading: boolean;
}

const IssueUpdatePanel: FC<IssueUpdatePanelProps> = ({
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
	const { updatedIssue, isAddingIssue, dispatch, update } = useUpdateIssue();
	const [isEditable, setEditable] = useState(true);
	const { theme } = useTheme();

	const handleIssueUpdate = useCallback(() => {
		update()
			.then((response: any) => {
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
			}
		};

		loadIframe();

		return () => {
			if (contentWindow) {
				contentWindow.removeEventListener('keydown', handleKeyDown);
			}
			clearTimeout(timeID!);
		};
	}, [handleKeyDown]);

	useEffect(() => {
		let contentWindow: Window | null;
		let themeTiny: NodeJS.Timeout | null = null;
		let attempts = 0;
		const maxAttempts = 10; // Establece el número máximo de intentos

		const loadIframe = () => {
			const iframe = document.getElementById(
				'issue_ifr',
			) as HTMLIFrameElement | null;

			if (!iframe) {
				attempts++;
				if (attempts < maxAttempts) {
					themeTiny = setTimeout(loadIframe, 200); // Intenta cargar de nuevo después de 3 segundos
				} else {
					console.error(
						'Se superó el número máximo de intentos para cargar el iframe.',
					);
				}
				return;
			}

			contentWindow = iframe.contentWindow!;

			const handleIframeLoad = () => {
				const body = contentWindow!.document.body;
				if (body) {
					body.setAttribute('data-theme', theme);
				}
			};

			if (
				iframe.contentWindow &&
				iframe.contentWindow.document.readyState === 'complete'
			) {
				handleIframeLoad();
			} else {
				iframe.onload = handleIframeLoad;
			}
		};

		loadIframe();

		return () => {
			if (themeTiny) {
				clearTimeout(themeTiny);
			}
		};
	}, [theme]);

	useEffect(
		() =>
			dispatch((state: UpdateIssue) => ({
				...state,
				id: safelyIssue().id,
				issueName: safelyIssue().name,
				score: safelyIssue().riskScore,
			})),
		[completeIssue],
	);

	return (
		<Show when={!isLoading} fallback={<PageLoader />}>
			<>
				<div className="header">
					<div className="back" onClick={() => navigate('/issues')}>
						<LeftArrow isButton />
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
							onChange={(e) =>
								dispatch((state: UpdateIssue) => ({
									...state,
									issueName: e.target.value,
								}))
							}
						/>
					</Show>
					<div className="work-buttons">
						<div
							className={`edit edit_btn  ${!isEditable ? 'on' : 'off'}`}
							onClick={() => setEditable(!isEditable)}>
							<PencilIcon isButton />
						</div>
						<div
							className={`save edit_btn ${!isEditable ? 'on' : 'off'}`}
							onClick={() => handleIssueUpdate()}>
							<SaveIcon isButton />
						</div>
					</div>
				</div>
				<div className="info">
					<div>
						Published: <span>{formatDate(safelyIssue().createdAt)}</span>
					</div>
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
						initialValue={safelyIssue().content ?? ''}
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
