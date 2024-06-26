

export const setTinyEditorContent = (id, value) => {
	if (!id && !value) return;
	
	const editor = tinyMCE.get(id);
	if(editor) editor.setContent(value);
};

const addTinyMce = (initialValue) => {
	if (tinyMCE.EditorManager.activeEditor) {
		tinyMCE.remove();
	}
	const options = {
		selector: '#issue',
		promotion: false,
		plugins: [
			'preview', 'importcss', 'searchreplace', 'autolink', 'autosave',
			'save', 'directionality', 'code', 'visualblocks', 'visualchars',
			'fullscreen', 'image', 'link', 'media', 'template', 'codesample',
			'table', 'charmap', 'pagebreak', 'nonbreaking', 'anchor',
			'insertdatetime', 'advlist', 'lists', 'wordcount', 'charmap',
			'quickbars', 'emoticons', 'accordion'
		  ],
		toolbar:
			'inserttemplate | undo redo | styles | strikethrough bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
		advlist_bullet_styles: 'square',
		table_use_colgroups: true,
		branding: false,
		placeholder: 'Type here...',
		paste_data_images: true,
		readonly: true,
		skin: 'codefend',
		content_css: 'codefend',
		image_caption: true,
		automatic_uploads: true,
		height: 'calc(100dvh - 161px)',
		templates: [
			{
				title: 'Issue A',
				description: 'simple issue, code, no media',
				url: '/editor-lib/visual/mce/models/01.html',
			},
			{
				title: 'Issue B',
				description: 'simple issue, code, no media',
				url: '/editor-lib/visual/mce/models/02.html',
			},
		],
	};
	try {
		tinyMCE.init(options);
		setTimeout(() => setTinyEditorContent('issue', initialValue), 500);
	} catch (e) {
		console.error(e);
	}
};

export const getTinyEditorContent = (id) => {
	if (!id) return '';
	return tinyMCE.get(id).getContent();
};

export const setMode = (id, mode) => {
	const editorHeader = document.querySelector('.tox-editor-header');
	if (editorHeader != null) {
		mode === 'design'
			? editorHeader.classList.add('editable')
			: editorHeader.classList.remove('editable');
	}
	return tinyMCE.get(id).mode.set(mode);
};

export default addTinyMce;
