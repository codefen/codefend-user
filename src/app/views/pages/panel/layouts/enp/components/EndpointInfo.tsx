import React, { useEffect, useState } from 'react';
import { BugIcon, CircleAskIcon, Show } from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext';

import { useAuthState, EnpService } from '../../../../../../data';

interface Props {}

export const EndpointInfo: React.FC<Props> = () => {
	const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
	const { endpointAppStore, setEndpointAppStore } = useEndpointAppStore();
	const [vuln, setVuln] = useState<any[]>([]);
	const [vulnFilter, setVulnFilter] = useState({
		type: 'p',
		order: 1,
	});
	const { getCompany } = useAuthState();

	useEffect(() => {
		setSelectedEndpoint(null);
		setVuln([]);
		setVulnFilter({
			type: 'p',
			order: 1,
		});
		setSelectedEndpoint(endpointAppStore);
	}, [endpointAppStore]);

	useEffect(() => {
		if (selectedEndpoint?.code_name) {
			const companyID = getCompany();
			EnpService.getVulns(selectedEndpoint?.code_name, companyID).then(
				(enp) => {
					setVuln(enp.data);
				},
			);
		}
	}, [selectedEndpoint]);

	function compareVersions(versionA: any, versionB: any) {
		if (!versionA) return -1;
		if (!versionB) return 0;

		const partsA = versionA.split('.').map(Number);
		const partsB = versionB.split('.').map(Number);

		const maxLength = Math.max(partsA.length, partsB.length);

		for (let i = 0; i < maxLength; i++) {
			const partA = partsA[i] || 0;
			const partB = partsB[i] || 0;

			if (partA > partB) return 1;
			if (partA < partB) return -1;
		}

		return 0;
	}

	function parseDate(date: any) {
		const parsedDate = new Date(date);
		return parsedDate.toISOString().split('T')[0];
	}

	function highlightApplicationName(title: string, appName: string) {
		const lowerCaseTitle = title.toLowerCase();
		const lowerCaseAppName = appName.toLowerCase();

		if (!lowerCaseTitle.includes(lowerCaseAppName)) {
			return title;
		}

		const index = lowerCaseTitle.indexOf(lowerCaseAppName);

		const before = title.substring(0, index);
		const match = title.substring(index, index + appName.length);
		const after = title.substring(index + appName.length);

		return (
			<>
				{before}
				<span className="text-red-500">{match}</span>
				{after}
			</>
		);
	}

	function mapScoreToWord(score: number) {
		const mapping: { [key: number]: string } = {
			0: '?',
			1: 'intel',
			2: 'low',
			3: 'medium',
			4: 'elevated',
			5: 'critical',
		};

		return mapping[score] || '?';
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

	const filterByCve = () => {
		let sorted;
		const filter = vulnFilter;

		if (filter.type === 'c') {
			sorted = [...vuln].sort((a: any, b: any) =>
				filter.order === 1
					? a.cve.localeCompare(b.cve)
					: b.cve.localeCompare(a.cve),
			);
			setVulnFilter({ type: 'c', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort((a: any, b: any) =>
				a.cve.localeCompare(b.cve),
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
				filter.order === 1 ? b.score - a.score : a.score - b.score,
			);
			setVulnFilter({ type: 's', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort((a: any, b: any) => a.score - b.score);
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
					? b.score.localeCompare(a.score)
					: a.score.localeCompare(b.score),
			);
			setVulnFilter({ type: 'r', order: filter.order === 1 ? -1 : 1 });
		} else {
			sorted = [...vuln].sort((a: any, b: any) =>
				a.score.localeCompare(b.score),
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
							onClick={() => filterByCve()}>
							cve
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
											{parseDate(vulnerability.date)}
										</div>
										<div className="table-item">
											{vulnerability.vdb_id}
										</div>
										<div className="table-item xl">
											{vulnerability.cve}
										</div>
										<div className="table-item xll large-item">
											{highlightApplicationName(
												vulnerability.title,
												selectedEndpoint.application_name,
											)}
										</div>
										<div className="table-item xl vul-score">
											<span className="score">
												{!isNaN(parseInt(vulnerability.score))
													? vulnerability.score
													: 0}
											</span>
											{Array.from({ length: 5 }, (_, index) =>
												index <
												(parseInt(vulnerability.score) || 0) ? (
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
											when={!isNaN(parseInt(vulnerability.score))}>
											<div className="table-score-map table-item">
												{mapScoreToWord(vulnerability.score)}
											</div>
										</Show>
										<Show when={isNaN(parseInt(vulnerability.score))}>
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
