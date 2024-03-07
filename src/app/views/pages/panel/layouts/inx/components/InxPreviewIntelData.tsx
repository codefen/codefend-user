import React, { useRef, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import {
	Loader,
	PageLoader,
	PrimaryButton,
	Show,
} from '../../../../../components';
import { formatDateTimeFormat, useIntelPreview } from '../../../../../../data';
import { InxPreviusContentData } from './InxPreviusContentData';

interface Props {
	intel: any;
	readFile: (intel: any) => void;
	companyID: string;
	intelLenght: number;
	index: number;
}

export const InxPreviewIntelData: React.FC<Props> = ({
	intel,
	readFile,
	companyID,
	intelLenght,
	index,
}) => {
	const { isIntersecting, ref } = useIntersectionObserver({
		threshold: 0.5,
	});
	const { intelPreview, isLoadingPreview, refetchPreview } = useIntelPreview();
	const [previewReq, setPreviewReq] = useState<boolean>(false);

	//Try to run every time the html appears or exits the screen
	if (isIntersecting && !previewReq) {
		const params = {
			sid: intel.storage_id,
			bid: intel.bucket_id,
			mid: intel.media_id,
		};

		refetchPreview(params, companyID);

		//Traffic light so that it only executes the first time it appears on the screen
		setPreviewReq(true);
	}

	const formatDate = formatDateTimeFormat(intel.date);
	return (
		<article
			ref={ref}
			className="intel-data-card"
			onClick={() => readFile(intel)}>
			<header className="intel-data-header">
				<div className="title-container">
					<h3 className="intel-header-title" title={intel.name}>
						{intel.name.slice(0, 50)}
					</h3>
				</div>
				<div className="secondary-title">
					<h4 className="intel-header-title intel-secondary-title">
						{intel.bucket_data}
					</h4>
					<span className="intel-header-text" title={formatDate}>
						{formatDate}
					</span>
				</div>
			</header>

			<section className="intel-data-content">
				<InxPreviusContentData
					loading={isLoadingPreview}
					preview={intelPreview}
					storageID={intel.storage_id}
				/>
			</section>
		</article>
	);
};
