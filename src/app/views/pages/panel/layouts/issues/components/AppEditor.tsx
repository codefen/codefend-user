import React, { useEffect, useMemo } from 'react';
import addTinyMce, {
	getTinyEditorContent,
	setMode,
} from '../../../../../../../editor-lib/';
import { CompleteIssue, Issues } from '../../../../../../data';

interface AppEditorProps {
	onUpdateIssue?: any;
	initialValue: string;
	isEditable: boolean;
	isIssueCreation?: any;
}
const AppEditor: React.FC<AppEditorProps> = ({
	initialValue,
	onUpdateIssue,
	isEditable,
}) => {
	/* const emptyUpdateIssueText = () => '<p>Please add issues here...</p>';

	useEffect(() => {
		const defaultValue = !Boolean(initialValue.trim().length)
			? emptyUpdateIssueText()
			: initialValue;

		addTinyMce(defaultValue);
	}, [initialValue]); */

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
			<textarea name="name" id="issue" rows={4} cols={40}></textarea>
		</>
	);
};

export default AppEditor;
