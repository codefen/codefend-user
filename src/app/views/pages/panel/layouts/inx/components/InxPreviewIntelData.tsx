import React, { useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { PrimaryButton } from '../../../../../components';

interface Props {
	intelKey: string;
	intel: any;
	readFile: (intel: any) => void;
	intelPreview: any;
}

export const InxPreviewIntelData: React.FC<Props> = ({
	intelKey,
	intel,
	readFile,
	intelPreview,
}) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const entry = useIntersectionObserver(ref, {});
	const isVisible = !!entry?.isIntersecting;

	return (
		<div ref={ref}>
			<div className="w-full flex flex-row h-10 bg-[#f0f0f0] text-[#333]">
				<div className="w-full red-border flex flex-row items-center px-7 ">
					<label className="flex items-center max-w-[365px] min-w-[365px] text-left truncate">
						<input
							type="checkbox"
							defaultChecked
							className=" checkbox-color"
						/>
						<span className="flex-grow ml-3">
							{intel?.name?.slice(0, 50)}
						</span>
					</label>

					<span className="flex-grow ml-3">{intel.bucket_data}</span>
					<span className="text-[#666] text-xs">{intel.date}</span>
				</div>
				<PrimaryButton
					text="Full data"
					click={(e: React.FormEvent) => readFile(intel)}
					className="no-border-height h-full items-center justify-center text-sm w-[5.3rem] no-padding"
				/>
			</div>

			<div className="w-full internal-tables disable-border no-border border-bottom py-2">
				<div>
					<div className="flex py-0.5 pl-14 pr-10">
						<div
							className="max-w-md"
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
