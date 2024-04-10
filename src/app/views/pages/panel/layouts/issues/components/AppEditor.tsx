import { type FC, useEffect } from 'react';
import addTinyMce, { setMode } from '../../../../../../../editor-lib';

interface AppEditorProps {
	onUpdateIssue?: any;
	initialValue: string;
	isEditable: boolean;
	isIssueCreation?: any;
}

const EMPTY_TEXT = '<p>Please add issues here...</p>';

const AppEditor: FC<AppEditorProps> = ({ initialValue, isEditable }) => {
	useEffect(() => {
		console.log({ condForDefault: !Boolean(initialValue.trim().length) });
		const defaultValue = !Boolean(initialValue.trim().length)
			? EMPTY_TEXT
			: initialValue;

		addTinyMce(defaultValue);
	}, [initialValue]);

	useEffect(() => {
		if (isEditable) {
			setMode('issue', 'design');
		} else {
			setMode('issue', 'readonly');
		}
	}, [isEditable]);

	return (
		<>
			<textarea
				name="name"
				id="issue"
				rows={4}
				cols={40}
				defaultValue=""></textarea>
		</>
	);
};

export default AppEditor;
