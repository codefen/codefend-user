import React, { useRef, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { PrimaryButton } from '../../../../../components';
import { formatDateTimeFormat, useIntelPreview } from '../../../../../../data';

interface Props {
	intel: any;
	readFile: (intel: any) => void;
	companyID: string;
}

export const InxPreviewIntelData: React.FC<Props> = ({
	intel,
	readFile,
	companyID,
}) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const entry = useIntersectionObserver(ref, {});
	const { intelPreview, isLoadingPreview, refetchPreview } = useIntelPreview();
	const [previewReq, setPreviewReq] = useState<boolean>(false);

	//Try to run every time the html appears or exits the screen
	const isVisible = !!entry?.isIntersecting;
	if (isVisible && !previewReq) {
		const params = {
			sid: intel.storage_id,
			bid: intel.bucket_id,
			mid: intel.media_id,
		};

		refetchPreview(params, companyID)?.then(() => {});

		//Traffic light so that it only executes the first time it appears on the screen
		setPreviewReq(true);
	}

	//Retrieves the preview to show it if the storage IDs match
	const previewHTML = intelPreview
		.find((preview: any) => preview.id === intel.storage_id)
		?.preview?.split(/\r?\n/)
		.map((line: any) => {
			const [domain, owner, email] = line.split('\t');
			return `<p><strong>${domain}</strong>: ${owner} - ${email}</p>`;
		})
		.join('');

	return (
		<article ref={ref} className="intel-data-card">
			<header className="intel-data-header">
				<h3 className="codefend-text-red intel-header-title">
					{intel.name.slice(0, 50)}
				</h3>
				<span className="intel-header-text intel-header-mid-dash">-</span>
				<span className="intel-header-text">
					{formatDateTimeFormat(intel.date)}
				</span>
			</header>

			<section className="intel-data-content">
				<div
					className="intel-preview-container"
					dangerouslySetInnerHTML={{
						__html: previewHTML || 'There are no previews yet',
					}}></div>
			</section>
		</article>
	);
};
