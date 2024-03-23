import { type FC, useEffect } from 'react';
import addTinyMce, { setMode } from '../../../../../../../editor-lib';

interface AppEditorProps {
	onUpdateIssue?: any;
	initialValue: string;
	isEditable: boolean;
	isIssueCreation?: any;
}
const AppEditor: FC<AppEditorProps> = ({ initialValue, isEditable }) => {
	const emptyUpdateIssueText = () => '<p>Please add issues here...</p>';

	useEffect(() => {
		const defaultValue = !Boolean(initialValue.trim().length)
			? emptyUpdateIssueText()
			: initialValue;

		addTinyMce(defaultValue);
	}, [initialValue]);

	useEffect(() => {
		const timeID = setTimeout(() => {
			if (isEditable) {
				setMode('issue', 'design');
			} else {
				setMode('issue', 'readonly');
			}
		}, 35);
		return () => clearTimeout(timeID);
	}, [isEditable]);

	return (
		<>
			<textarea
				name="name"
				id="issue"
				rows={4}
				cols={40}
				defaultValue={''}></textarea>
		</>
	);
};

export default AppEditor;
