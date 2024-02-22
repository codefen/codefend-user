import React, { useRef, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { PrimaryButton } from '../../../../../components';
import { useIntelPreview } from '../../../../../../data';

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
	const { intelPreview, refetchPreview } = useIntelPreview();
	const [previewReq, setPreviewReq] = useState<boolean>(false);

	const isVisible = !!entry?.isIntersecting;

	console.log({ isVisible });

	if (isVisible && !previewReq) {
		const params = {
			sid: intel.storage_id,
			bid: intel.bucket_id,
			mid: intel.media_id,
		};

		refetchPreview(params, companyID)?.then(() => {});
		setPreviewReq(true);
	}

	return (
		<div ref={ref}>
			<div className="intel-data-left">
				<div className="intel-data-left-content">
					<label className="intel-label">
						<input
							type="checkbox"
							defaultChecked
							className="codefend-checkbox"
						/>
						<span className="intel-text-label">
							{intel?.name?.slice(0, 50)}
						</span>
					</label>

					<span className="intel-bucket-data ">{intel.bucket_data}</span>
					<span className="intel-date">{intel.date}</span>
				</div>
				<PrimaryButton
					text="Full data"
					click={(e: React.FormEvent) => readFile(intel)}
					className="no-border-height no-padding full-data-btn"
				/>
			</div>

			<div className="internal-tables disable-border no-border intel-data-right">
				<div>
					<div className="intel-preview-data">
						<div
							className="preview-wrapper"
							dangerouslySetInnerHTML={{
								__html: intelPreview
									.find(
										(preview: any) => preview.id === intel.storage_id,
									)
									?.preview?.replace(/(\r\n|\n|\r)/g, '<br>'),
							}}></div>
					</div>
				</div>
			</div>
		</div>
	);
};
