import { PageLoader, Show } from '../../../../../components';

interface Props {
	preview: any;
	storageID: any;
	loading: boolean;
}

export const InxPreviusContentData: React.FC<Props> = ({
	preview,
	storageID,
	loading,
}) => {
	//Retrieves the preview to show it if the storage IDs match
	const previewHTML = preview
		.find((preview: any) => preview.id === storageID)
		?.preview?.split(/\r?\n/)
		.map((line: any) => {
			const parts = line.split('\t');
			if (parts.length === 3) {
				const [domain, owner, email] = parts;
				return `<p><strong>${domain}</strong>: ${owner} - ${email}</p>`;
			} else {
				return `<p>${line}</p>`; // Tratar líneas sin tabuladores de otra manera
			}
		})
		.join('');

	return (
		<Show
			when={!loading}
			fallback={
				<div className="loader">
					<PageLoader />
				</div>
			}>
			<div
				className="intel-preview-container"
				dangerouslySetInnerHTML={{
					__html: previewHTML || 'There are no previews yet',
				}}
			/>
		</Show>
	);
};
