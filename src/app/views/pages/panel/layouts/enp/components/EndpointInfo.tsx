import React, { useEffect, useState } from 'react';
import { FaBug } from "react-icons/fa";
import { Show } from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext';
import { BsInfoCircleFill } from "react-icons/bs";

import {
	useAuthState,
	EnpService
} from '../../../../../../data';

interface Props {}

export const EndpointInfo: React.FC<Props> = () => {
    const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
    const { endpointAppStore, setEndpointAppStore } = useEndpointAppStore();
	const [vuln, setVuln] = useState<any[]>([]);
	const [vulnFilter, setVulnFilter] = useState({
	  type: "p",
	  order: 1
	});
	const { getUserdata } = useAuthState();

    useEffect(() => {
        setSelectedEndpoint(null);
        setVuln([]);
		setVulnFilter({
			type: "p",
			order: 1
		})
        setSelectedEndpoint(endpointAppStore);
    }, [endpointAppStore]);

  
	useEffect(() => {
	  if (selectedEndpoint?.code_name) {
		const companyID = getUserdata()?.companyID as string;
		EnpService.getVulns(selectedEndpoint?.code_name, companyID)
		  .then((enp) => {
			setVuln(enp.data);
		  });
	  }
	}, [selectedEndpoint])
  
	

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
			5: 'critical'
		};
	
	  return mapping[score] || '?';
	}
  
	// Filters
	
	const filterByDate = () => {
	  let sorted;
	  const filter = vulnFilter;
	  
	  if (filter.type === 'p') {
		sorted = [...vuln].sort((a: any, b: any) => (filter.order === 1 ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime()));
		setVulnFilter({ type: 'p', order: filter.order === 1 ? -1 : 1 });
	  } else {
		sorted = [...vuln].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
		setVulnFilter({ type: 'p', order: 1 });
	  }
	  
	  setVuln(sorted);
	};
  
	const filterByVdb = () => {
	  let sorted;
	  const filter = vulnFilter;
  
	  if (filter.type === 'v') {
		sorted = [...vuln].sort((a: any, b: any) => filter.order === 1 ? a.vdb_id.localeCompare(b.vdb_id) : b.vdb_id.localeCompare(a.vdb_id));
		setVulnFilter({ type: 'v', order: filter.order === 1 ? -1 : 1 });
	  } else {
		sorted = [...vuln].sort((a: any, b: any) => a.vdb_id.localeCompare(b.vdb_id));
		setVulnFilter({ type: 'v', order: 1 });
	  }
  
	  setVuln(sorted);
	};
  
	const filterByCve = () => {
	  let sorted;
	  const filter = vulnFilter;
  
	  if (filter.type === 'c') {
		sorted = [...vuln].sort((a: any, b: any) => filter.order === 1 ? a.cve.localeCompare(b.cve) : b.cve.localeCompare(a.cve));
		setVulnFilter({ type: 'c', order: filter.order === 1 ? -1 : 1 });
	  } else {
		sorted = [...vuln].sort((a: any, b: any) => a.cve.localeCompare(b.cve));
		setVulnFilter({ type: 'c', order: 1 });
	  }
	  setVuln(sorted);
	};
  
	const filterByTitle = () => {
	  let sorted;
	  const filter = vulnFilter;
  
	  if (filter.type === 't') {
		sorted = [...vuln].sort((a: any, b: any) => filter.order === 1 ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
		setVulnFilter({ type: 't', order: filter.order === 1 ? -1 : 1 });
	  } else {
		sorted = [...vuln].sort((a: any, b: any) => a.title.localeCompare(b.title));
		setVulnFilter({ type: 't', order: 1 });
	  }
  
	  setVuln(sorted);
	};
  
	const filterByScore = () => {
	  let sorted;
	  const filter = vulnFilter;
  
	  if (filter.type === 's') {
		sorted = [...vuln].sort((a: any, b: any) => filter.order === 1 ? b.score - a.score : a.score - b.score);
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
		sorted = [...vuln].sort((a: any, b: any) => filter.order === 1 ? b.score.localeCompare(a.score) : a.score.localeCompare(b.score));
		setVulnFilter({ type: 'r', order: filter.order === 1 ? -1 : 1 });
	  } else {
		sorted = [...vuln].sort((a: any, b: any) => a.score.localeCompare(b.score));
		setVulnFilter({ type: 'r', order: 1 });
	  }
  
	  setVuln(sorted);
	};
  

    return (
		<div className="table flex-grow">
			<div className="flex flex-col p-4">
			  <div className="flex items-center justify-between border-solid border border-stone-200">
				<div className="flex p-2 items-start w-1/3 border-solid border-r border-stone-200 pb-8 hover:bg-slate-50 duration-300 ease-in-out">
				  <div className="inline-flex h-[6.5rem]">
					<span className="m-4 w-20 h-20 inline-flex rounded-md border-solid border border-stone-200 opacity-75">
					  <Show when={selectedEndpoint?.icon_url}>
						<img src={selectedEndpoint?.icon_url} alt="" className="relative w-20 h-20 object-cover rounded-md">
						</img>
					  </Show>
					</span>
				  </div>
	
				  <div className="flex flex-col ml-1">
					<div className="text-lg mt-6 font-bold leading-none text-gray-500">{selectedEndpoint?.application_name ? selectedEndpoint?.application_name : 'Please select an app in order to view it'}</div>
					<p className="text-sm text-gray-400 leading-none mt-1 truncate">{selectedEndpoint?.organization}</p>
					<p className="text-sm text-gray-400 leading-none mt-1 truncate">Version: {selectedEndpoint?.current_version}</p>
				  </div>
				</div>
	
				{selectedEndpoint?.application_name ?
				  <div className="flex flex-col items-center w-2/3 h-36 border-solid border-stone-200 hover:cursor-default">
					<div className="flex flex-grow w-full h-4 border-b">
					  <div className="flex items-center w-1/3 border-solid border-r border-stone-200 hover:bg-slate-50 duration-300 ease-in-out">
						<div className="flex ml-4">
						  <p className="text-sm text-gray-600 leading-none mt-1 truncate">Reported vulnerabilities:</p>
						  	{
								vuln.length > 0 && vuln[0].title !== "none" ? (
									<div className="group flex relative">
										<p className="text-sm text-gray-400 leading-none mt-1 ml-1 truncate">{vuln.length}</p>
									</div>
								) : vuln.length > 0 && vuln[0].title === "none" ? (
									<div className="group flex relative">
										<p className="text-sm text-gray-400 leading-none mt-1 ml-1 truncate">0</p>
										<p className="text-sm text-gray-400 leading-none mt-1 ml-3 truncate"><BsInfoCircleFill/></p>
										<span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
										-translate-x-1/2 translate-y-full opacity-0 m-2 mx-auto truncate">We've found 0 indexed vulnerabilities in our scan, but this may change</span>
									</div>
								) : vuln.length === 0 ? (
									<div className="group flex relative">
										<p className="text-sm text-gray-400 leading-none mt-1 ml-1 truncate">?</p>
										<p className="text-sm text-gray-400 leading-none mt-1 ml-3 truncate"><BsInfoCircleFill/></p>
										<span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
										-translate-x-1/2 translate-y-full opacity-0 m-2 mx-auto truncate">The vulnerabilities are pending to be scanned</span>
									</div>
								) : null
							}
						</div> 
					  </div>
					  <div className="flex items-center w-1/3 border-solid border-r border-stone-200 hover:bg-slate-50 duration-300 ease-in-out">
						<div className="flex ml-4">
						  <p className="text-sm text-gray-600 leading-none mt-1 truncate">Latest version:</p>
						  <p className="text-sm text-gray-400 leading-none mt-1 ml-1 truncate">{compareVersions(selectedEndpoint?.latest_version, selectedEndpoint?.current_version) !== -1 ? selectedEndpoint?.latest_version : "?"}</p>
						</div>
					  </div>
					  {
						compareVersions(selectedEndpoint?.latest_version, selectedEndpoint?.current_version) === 0 ? (
						<div className="bg-green-50 flex items-center w-1/3 border-solid border-stone-200 hover:bg-slate-50 duration-300 ease-in-out">
							<div className="flex ml-4">
							<p className="text-green-500 text-sm leading-none mt-1 truncate">Installed:</p>
							<p className="text-green-500 text-sm leading-none mt-1 ml-1 truncate">{selectedEndpoint?.current_version}</p>
							</div>
						</div>
						) : compareVersions(selectedEndpoint?.latest_version, selectedEndpoint?.current_version) === 1 ? (
						<div className="bg-red-50 flex items-center w-1/3 border-solid border-stone-200 hover:bg-slate-50 duration-300 ease-in-out">
							<div className="flex ml-4">
							<p className="text-red-600 text-sm leading-none mt-1 truncate">Installed:</p>
							<p className="text-red-600 text-sm leading-none mt-1 ml-1 truncate">{selectedEndpoint?.current_version}</p>
							</div>
						</div>
						) : (
						<div className="flex items-center w-1/3 border-solid border-stone-200 hover:bg-slate-50 duration-300 ease-in-out">
							<div className="flex ml-4">
							<p className="text-gray-600 text-sm leading-none mt-1 truncate">Installed: {selectedEndpoint?.current_version}</p>
							</div>
						</div>
						)
					}
					</div>
	
					<div className="flex flex-wrap flex-grow w-full hover:bg-slate-50 duration-300 ease-in-out">
					  <div className="flex p-4 items-start border-solid border-stone-200 w-full">
						<p className="text-sm text-gray-600 leading-none mt-1 whitespace-pre-wrap">Information: {selectedEndpoint?.summary}</p>
					  </div>
					</div>
				  </div>
				  :
				  ""
				}
			  </div>
			  <div className="border-solid border border-stone-200 flex-grow mt-8 text-red-400 hover:cursor-default">
				<div className="flex p-4">
				  <p className="text-sm text-red-400 leading-none mt-1 truncate"><FaBug/></p>
				  <p className="text-sm font-black text-red-400 leading-none mt-1 ml-2 truncate uppercase">{selectedEndpoint?.application_name}</p>
				  <p className="text-sm font-bold text-gray-700 leading-none mt-1 ml-2 truncate uppercase">Recently reported vulnerabilities</p>
				</div>
	
				<div className="flex p-4 text-gray-700">
				  <div className={(vulnFilter.type == "p" ? "underline text-red-400 " : "") + "w-1/12 hover:cursor-pointer hover:text-red-500  duration-300 ease-in-out"} onClick={() => filterByDate()}>published</div>
				  <div className={(vulnFilter.type == "v" ? "underline text-red-400 " : "") + "w-1/12 hover:cursor-pointer hover:text-red-500  duration-300 ease-in-out"} onClick={() => filterByVdb()}>vdb id</div>
				  <div className={(vulnFilter.type == "c" ? "underline text-red-400 " : "") + "w-2/12 hover:cursor-pointer hover:text-red-500  duration-300 ease-in-out"} onClick={() => filterByCve()}>cve</div>
				  <div className={(vulnFilter.type == "t" ? "underline text-red-400 " : "") + "w-5/12 hover:cursor-pointer hover:text-red-500  duration-300 ease-in-out"} onClick={() => filterByTitle()}>title</div>
				  <div className={(vulnFilter.type == "s" ? "underline text-red-400 " : "") + "w-2/12 hover:cursor-pointer hover:text-red-500  duration-300 ease-in-out"} onClick={() => filterByScore()}>score</div>
				  <div className={(vulnFilter.type == "r" ? "underline text-red-400 " : "") + "w-1/12 hover:cursor-pointer hover:text-red-500  duration-300 ease-in-out"} onClick={() => filterByRisk()}>risk</div>
				</div>
				<div className="max-h-[65vh] overflow-y-auto overflow-x-hidden">
					{
						(vuln.length > 0 && vuln[0].title !== "none") ? vuln.map((vulnerability: any) => (
							<div key={vulnerability.id} className="flex items-center h-10 p-4 py-6 border-b border-gray-200 text-sm font-questrial hover:bg-slate-50 duration-300 ease-in-out">
								<div className="w-1/12 text-gray-400">{parseDate(vulnerability.date)}</div>
								<div className="w-1/12 text-gray-400">{vulnerability.vdb_id}</div>
								<div className="w-2/12 text-gray-400">{vulnerability.cve}</div>
								<div className="w-5/12 text-gray-400">{highlightApplicationName(vulnerability.title, selectedEndpoint.application_name)}</div>
								<div className="pl-2 w-2/12 text-gray-400 flex items-center">
									<span className="text-red-500 mr-2">{!isNaN(parseInt(vulnerability.score)) ? vulnerability.score : 0}</span>
									{
										Array.from({ length: 5 }, (_, index) => index < (parseInt(vulnerability.score) || 0) ?
											<div key={index} className="p-1 ml-0.5 rounded-full border border-red-400 bg-red-400"></div> :
											<div key={index} className="p-1 ml-0.5 rounded-full border border-red-400 bg-transparent"></div>
										)
									}
								</div>
							
								<Show when={!isNaN(parseInt(vulnerability.score))}>
									<div className="pl-2 w-1/12 text-gray-400">{mapScoreToWord(vulnerability.score)}</div>
								</Show>
								<Show when={isNaN(parseInt(vulnerability.score))}>
									<div className="group flex relative">
									<p className="pl-2 w-1/12 text-gray-400">?</p>
									<p className="text-sm text-gray-400 leading-none mt-1 ml-3 truncate"><BsInfoCircleFill/></p>
									<span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-xs text-gray-100 rounded-md absolute left-1/2 
									-translate-x-1/2 translate-y-full opacity-0 m-2 max-w-48 mx-auto truncate">The vulnerability doesn't have a category yet</span>
									</div>
								</Show>
							</div>
						)) : ''
					}
				  <Show when={vuln.length > 0 && vuln[0].title == "none"}>
					<div className="flex items-center h-10 p-4 py-6 border-b border-gray-200 text-normal font-questrial hover:bg-slate-50 duration-300 ease-in-out">
					  <div className="w-12/12 text-gray-400">There are currently no indexed vulnerabilities for this application.</div>
					</div>
				  </Show>
				</div>
			  </div>
			</div>
		</div>
    );
};