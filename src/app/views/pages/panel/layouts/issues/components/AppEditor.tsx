import { type FC, useEffect, useState } from 'react';
import addTinyMce, {
  setMode,
  setTinyEditorContent,
  getTinyEditorContent,
} from '../../../../../../../editor-lib';

interface AppEditorProps {
  initialValue: string;
  isEditable: boolean;
  isCreation?: boolean;
  isLoaded?: boolean;
}
const EMPTY_TEXT = '<p>Please add issues here...</p>';
const startTiny = (initialValue: string) => {
  try {
    const content = getTinyEditorContent('issue');
    setTinyEditorContent('issue', content ? content : initialValue);
  } catch (e) {
    console.error(e);
  }
};

const AppEditor: FC<AppEditorProps> = ({ initialValue, isEditable, isCreation, isLoaded }) => {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    const defaultValue = !Boolean(initialValue) ? EMPTY_TEXT : initialValue;
    addTinyMce(defaultValue);
    setFirst(false);
    startTiny(initialValue);
  }, [initialValue, isLoaded]);

  useEffect(() => {
    if (!first) {
      startTiny(initialValue);
    }

    if (!isCreation) {
      setMode('issue', isEditable ? 'design' : 'readonly');
    } else {
      setMode('issue', 'design');
    }
  }, [isEditable, isLoaded]);

  return <textarea name="name" id="issue" rows={4} cols={40}></textarea>;
};

export default AppEditor;
