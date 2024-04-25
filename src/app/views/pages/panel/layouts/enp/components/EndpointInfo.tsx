import { type FC, useEffect } from 'react';
import { BugIcon, CircleAskIcon, Show } from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext.tsx';
import {
	extractCWEID,
	compareVersions,
	mapScoreToWord,
	highlightToBeforeAfterMatch,
} from '@utils/helper.ts';
import { useEnpGetVulns } from '@moduleHooks/enp/useEnpGetVulns';

export const EndpointInfo: FC = () => {
	const { endpointAppStore, setEndpointAppStore } = useEndpointAppStore();
	const {
		vuln,
		selectedEndpoint,
		vulnFilter,
		setVuln,
		setVulnFilter,
		setSelectedEndpoint,
		refetch,
	} = useEnpGetVulns();

	useEffect(() => {
		setVuln([]);
		setVulnFilter({
			type: 'p',
			order: 1,
		});
		setSelectedEndpoint(endpointAppStore);
	}, [endpointAppStore]);

	useEffect(() => {
		if (selectedEndpoint?.code_name) {
			refetch();
		}
	}, [selectedEndpoint]);

	function parseDate(timestamp: any) {
		const parsedDate = new Date(timestamp * 1000);
		return parsedDate.toISOString().split('T')[0];
	}

	function highlightApplicationName(titleS: string, appName: string) {
		const { before, match, after, title } = highlightToBeforeAfterMatch(
			titleS,
			appName,
		);
		if (title) return title;

		return (
			<>
				{before}
				<span className="text-red-500">{match}</span>
				{after}
			</>
		);
	}

	// Filters

	const filterByDate = () => {
		let sorted;
		const filter = vulnFilter;

		if (filter.type === 'p') {
			sorted = [...vuln].sort((a: any, b: any) =>
				filter.order === 1
					? new Date(a.date).getTime() - new Date(b.date).getTime()
					: new Date(b.date).getTime() - new Date(a.date).getTime(),
			);
			setVulnFilter({ type: 'p', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort(
				(a: any, b: any) =>
					new Date(a.date).getTime() - new Date(b.date).getTime(),
			);
			setVulnFilter({ type: 'p', order: 1 });
		}

		setVuln(sorted);
	};

	const filterByVdb = () => {
		let sorted;
		const filter = vulnFilter;

		if (filter.type === 'v') {
			sorted = [...vuln].sort((a: any, b: any) =>
				filter.order === 1
					? a.vdb_id.localeCompare(b.vdb_id)
					: b.vdb_id.localeCompare(a.vdb_id),
			);
			setVulnFilter({ type: 'v', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort((a: any, b: any) =>
				a.vdb_id.localeCompare(b.vdb_id),
			);
			setVulnFilter({ type: 'v', order: 1 });
		}

		setVuln(sorted);
	};

	const filterByCwe = () => {
		let sorted;
		const filter = vulnFilter;

		if (filter.type === 'c') {
			sorted = [...vuln].sort((a: any, b: any) =>
				filter.order === 1
					? Number(extractCWEID(a.vulnerability)) -
						Number(extractCWEID(b.vulnerability))
					: Number(extractCWEID(b.vulnerability)) -
						Number(extractCWEID(a.vulnerability)),
			);
			setVulnFilter({ type: 'c', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort(
				(a, b) =>
					Number(extractCWEID(a.vulnerability)) -
					Number(extractCWEID(b.vulnerability)),
			);
			setVulnFilter({ type: 'c', order: 1 });
		}
		setVuln(sorted);
	};
	const filterByTitle = () => {
		let sorted;
		const filter = vulnFilter;

		if (filter.type === 't') {
			sorted = [...vuln].sort((a: any, b: any) =>
				filter.order === 1
					? a.title.localeCompare(b.title)
					: b.title.localeCompare(a.title),
			);
			setVulnFilter({ type: 't', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort((a: any, b: any) =>
				a.title.localeCompare(b.title),
			);
			setVulnFilter({ type: 't', order: 1 });
		}

		setVuln(sorted);
	};

	const filterByScore = () => {
		let sorted;
		const filter = vulnFilter;

		if (filter.type === 's') {
			sorted = [...vuln].sort((a: any, b: any) =>
				filter.order === 1
					? b.risk_value - a.risk_value
					: a.risk_value - b.risk_value,
			);
			setVulnFilter({ type: 's', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort(
				(a: any, b: any) => a.risk_value - b.risk_value,
			);
			setVulnFilter({ type: 's', order: 1 });
		}

		setVuln(sorted);
	};

	const filterByRisk = () => {
		let sorted;
		const filter = vulnFilter;

		if (filter.type === 'r') {
			sorted = [...vuln].sort((a: any, b: any) =>
				filter.order === 1
					? b.risk_value.localeCompare(a.risk_value)
					: a.risk_value.localeCompare(b.risk_value),
			);
			setVulnFilter({ type: 'r', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort((a: any, b: any) =>
				a.risk_value.localeCompare(b.risk_value),
			);
			setVulnFilter({ type: 'r', order: 1 });
		}

		setVuln(sorted);
	};

	return (
		<div className="table">
			<div className="selected-app-container">
				<div className="selected-info-app ">
					<div className="left-info">
						<div className="img-app-container">
							{selectedEndpoint?.icon_url ? (
								<img
									src={selectedEndpoint.icon_url}
									alt=""
									className="img-app"
									decoding="async"
									loading="lazy"
								/>
							) : selectedEndpoint?.application_name ? (
								<span className="img-app no-img">
									{selectedEndpoint?.application_name
										? selectedEndpoint?.application_name
												.charAt(0)
												.toUpperCase()
										: ''}
								</span>
							) : (
								<span className="img-app void"></span>
							)}
						</div>

						<div className="info-app-container">
							<div className="app-name">
								{selectedEndpoint?.application_name
									? selectedEndpoint?.application_name
									: 'Please select an app in order to view it'}
							</div>
							<p className="app-org">{selectedEndpoint?.organization}</p>
							<p className="app-current-version">
								Version: {selectedEndpoint?.current_version}
							</p>
						</div>
					</div>

					{selectedEndpoint?.application_name ? (
						<div className="right-info">
							<div className="right-top-info">
								<div className="vul-reported">
									<div className="vul-reported-wrapper">
										<p className="vul-title">
											Reported vulnerabilities:
										</p>
										{vuln.length > 0 && vuln[0].title !== 'none' ? (
											<div className="vul-len">
												<p className="vul-len-text">
													{vuln.length}
												</p>
											</div>
										) : vuln.length > 0 &&
										  vuln[0].title === 'none' ? (
											<div className="vul-len">
												<p className="vul-len-text">0</p>
												<p className="vul-len-text">
													<CircleAskIcon />
												</p>
												<span className="not-found-text">
													We've found 0 indexed vulnerabilities in
													our scan, but this may change
												</span>
											</div>
										) : vuln.length === 0 ? (
											<div className="waiting-container">
												<p className="ask-icon">?</p>
												<p className="ask-icon">
													<CircleAskIcon />
												</p>
												<span className="not-found-text">
													The vulnerabilities are pending to be
													scanned
												</span>
											</div>
										) : null}
									</div>
								</div>
								<div className="last-version">
									<div className="last-version-container">
										<p className="last-version-text">
											Latest version:
										</p>
										<p className="last-version-text">
											{compareVersions(
												selectedEndpoint?.latest_version,
												selectedEndpoint?.current_version,
											) !== -1
												? selectedEndpoint?.latest_version
												: '?'}
										</p>
									</div>
								</div>
								{compareVersions(
									selectedEndpoint?.latest_version,
									selectedEndpoint?.current_version,
								) === 0 ? (
									<div className="version-installed green-version">
										<div className="version-installed-wrapper">
											<p className="version-installed-text text-green">
												Installed:
											</p>
											<p className="version-installed-text add-m text-green">
												{selectedEndpoint?.current_version}
											</p>
										</div>
									</div>
								) : compareVersions(
										selectedEndpoint?.latest_version,
										selectedEndpoint?.current_version,
								  ) === 1 ? (
									<div className="version-installed red-version">
										<div className="version-installed-wrapper">
											<p className="version-installed-text text-red">
												Installed:
											</p>
											<p className="version-installed-text add-m text-red">
												{selectedEndpoint?.current_version}
											</p>
										</div>
									</div>
								) : (
									<div className="version-installed empty-version">
										<div className="version-installed-wrapper">
											<p className="version-installed-text">
												Installed:{' '}
												{selectedEndpoint?.current_version}
											</p>
										</div>
									</div>
								)}
							</div>

							<div className="right-botton-info">
								<div className="bottom-text-container">
									<p className="bottom-text">
										Information: {selectedEndpoint?.summary}
									</p>
								</div>
							</div>
						</div>
					) : (
						''
					)}
				</div>
				<div className="table-app">
					<div className="taable-app-header ">
						<p className="table-header-icon">
							<BugIcon />
						</p>
						<p className="table-header-app-name">
							{selectedEndpoint?.application_name}
						</p>
						<p className="table-header-title">
							Recently reported vulnerabilities
						</p>
					</div>

					<div className="table-app-columns">
						<div
							className={
								(vulnFilter.type == 'p' ? 'special ' : '') +
								'table-app-column l'
							}
							onClick={() => filterByDate()}>
							published
						</div>
						<div
							className={
								(vulnFilter.type == 'v' ? 'special ' : '') +
								'table-app-column'
							}
							onClick={() => filterByVdb()}>
							vdb id
						</div>
						<div
							className={
								(vulnFilter.type == 'c' ? 'special ' : '') +
								'table-app-column xl'
							}
							onClick={() => filterByCwe()}>
							cwe
						</div>
						<div
							className={
								(vulnFilter.type == 't' ? 'special ' : '') +
								'table-app-column xll'
							}
							onClick={() => filterByTitle()}>
							title
						</div>
						<div
							className={
								(vulnFilter.type == 's' ? 'special ' : '') +
								'table-app-column xl'
							}
							onClick={() => filterByScore()}>
							score
						</div>
						<div
							className={
								(vulnFilter.type == 'r' ? 'special' : '') +
								'table-app-column'
							}
							onClick={() => filterByRisk()}>
							risk
						</div>
					</div>
					<div className="table-app-rows">
						{vuln.length > 0 && vuln[0].title !== 'none'
							? vuln.map((vulnerability: any) => (
									<div
										key={vulnerability.id}
										className="table-row-item">
										<div className="table-item l">
											{parseDate(vulnerability.timestamp_create)}
										</div>
										<div className="table-item">
											{vulnerability.id}
										</div>
										<div className="table-item xl">
											{extractCWEID(vulnerability.vulnerability)}
										</div>
										<div className="table-item xll large-item">
											{highlightApplicationName(
												vulnerability.title,
												selectedEndpoint.application_name,
											)}
										</div>
										<div className="table-item xl vul-score">
											<span className="score">
												{!isNaN(parseInt(vulnerability.risk_value))
													? vulnerability.risk_value
													: 0}
											</span>
											{Array.from({ length: 5 }, (_, index) =>
												index <
												(parseInt(vulnerability.risk_value) ||
													0) ? (
													<div
														key={index}
														className="score-fill-balls "></div>
												) : (
													<div
														key={index}
														className="score-fill-balls empty"></div>
												),
											)}
										</div>

										<Show
											when={
												!isNaN(parseInt(vulnerability.risk_value))
											}>
											<div className="table-score-map table-item">
												{mapScoreToWord(vulnerability.risk_value)}
											</div>
										</Show>
										<Show
											when={isNaN(
												parseInt(vulnerability.risk_value),
											)}>
											<div className="table-score-group">
												<p className="question-mark">?</p>
												<p className="question-circle">
													<CircleAskIcon />
												</p>
												<span className="question-text">
													The vulnerability doesn't have a category
													yet
												</span>
											</div>
										</Show>
									</div>
								))
							: ''}
						<Show when={vuln.length > 0 && vuln[0].title == 'none'}>
							<div className="table-empty-rows">
								<div className="text">
									There are currently no indexed vulnerabilities for
									this application.
								</div>
							</div>
						</Show>
					</div>
				</div>
			</div>
		</div>
	);
};
