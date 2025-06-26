const OPTIONS = {
  selector: '#issue',
  promotion: false,
  plugins: [
    'preview',
    'importcss',
    'searchreplace',
    'autolink',
    'autosave',
    'save',
    'directionality',
    'code',
    'visualblocks',
    'visualchars',
    'fullscreen',
    'image',
    'link',
    'media',
    'template',
    'codesample',
    'table',
    'charmap',
    'pagebreak',
    'nonbreaking',
    'anchor',
    'insertdatetime',
    'advlist',
    'lists',
    'wordcount',
    'charmap',
    'quickbars',
    'emoticons',
    'accordion',
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
  height: 'calc(-92px + 100cqh)',
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

export const setTinyEditorContent = (id, value) => {
  if (!id || !value) {
    console.warn('setTinyEditorContent: ID o valor inválido');
    return false;
  }

  const editor = tinyMCE?.get?.(id);
  if (!editor) {
    console.error(`Editor con ID ${id} no encontrado`);
    return false;
  }
  try {
    editor.setContent(value);
    return true;
  } catch (error) {
    console.error('Error al establecer contenido del editor:', error);
    return false;
  }
};

const addTinyMce = initialValue => {
  if (typeof tinyMCE === 'undefined') {
    console.error('TinyMCE no está cargado');
    return;
  }

  if (tinyMCE?.EditorManager?.activeEditor) {
    tinyMCE.remove();
  }

  let retryTimeout = null;

  try {
    tinyMCE.init(OPTIONS);
    // Intentar establecer contenido
    const contentSet = setTinyEditorContent('issue', initialValue);
    if (!contentSet) {
      retryTimeout = setTimeout(() => {
        setTinyEditorContent('issue', initialValue);
      }, 500);
    }
  } catch (error) {
    console.error('Error al inicializar TinyMCE:', error);
  } finally {
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  }
};

export const getTinyEditorContent = id => {
  if (!id) {
    console.warn('getTinyEditorContent: ID inválido');
    return '';
  }

  const editor = tinyMCE?.get?.(id);
  if (!editor) {
    console.error(`Editor con ID ${id} no encontrado`);
    return '';
  }

  try {
    return editor.getContent();
  } catch (error) {
    console.error('Error al obtener contenido del editor:', error);
    return '';
  }
};

export const setMode = (id, mode) => {
  if (!id || !mode) {
    console.warn('setMode: ID o modo inválido');
    return;
  }

  const editorHeader = document.querySelector('.tox-editor-header');
  const editor = tinyMCE?.get?.(id);

  if (!editorHeader) {
    console.warn('Encabezado del editor no encontrado');
    return;
  }

  if (!editor) {
    console.error(`Editor con ID ${id} no encontrado`);
    return;
  }

  try {
    // Manipular clases del encabezado
    if (mode === 'design') {
      editorHeader.classList.add('editable');
    } else {
      editorHeader.classList.remove('editable');
    }

    // Establecer modo del editor
    editor.mode.set(mode);
  } catch (error) {
    console.error('Error al cambiar el modo del editor:', error);
  }
};

export const safeInitTinyMCE = (defaultValue, onSuccess, onError, isDarkMode) => {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    onError && onError(new Error('Not in browser environment'));
    return;
  }

  // Ensure TinyMCE is available
  if (typeof tinyMCE === 'undefined') {
    onError && onError(new Error('TinyMCE not loaded'));
    return;
  }

  // Wait for DOM to be fully ready
  const initEditor = () => {
    try {
      // Remove any existing editors
      if (tinyMCE.EditorManager.activeEditor) {
        try {
          tinyMCE.remove();
        } catch (removeError) {
          console.warn('Error removing existing editor:', removeError);
        }
      }

      // Ensure the textarea exists
      const textareaElement = document.getElementById('issue');
      if (!textareaElement) {
        throw new Error('Textarea element not found');
      }

      // Retry mechanism with exponential backoff
      const maxRetries = 3;
      let attempts = 0;

      const attemptInit = () => {
        attempts++;

        try {
          // Initialize TinyMCE
          tinyMCE.init({
            ...OPTIONS, // Your existing OPTIONS
            content_css: isDarkMode ? 'codefend-dark' : 'codefend',
            skin: isDarkMode ? 'codefend-dark' : 'codefend',
            selector: '#issue',
            setup: editor => {
              editor.on('init', () => {
                // Set initial content
                editor.setContent(defaultValue);
                onSuccess && onSuccess();
              });

              editor.on('error', e => {
                console.error('TinyMCE initialization error:', e);
                if (attempts < maxRetries) {
                  setTimeout(attemptInit, attempts * 500);
                } else {
                  onError && onError(new Error('Failed to initialize TinyMCE'));
                }
              });
            },
          });
        } catch (initError) {
          console.error('TinyMCE init attempt failed:', initError);
          if (attempts < maxRetries) {
            setTimeout(attemptInit, attempts * 500);
          } else {
            onError && onError(initError);
          }
        }
      };

      // Start first attempt
      attemptInit();
    } catch (error) {
      onError && onError(error);
    }
  };

  // Ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditor);
  } else {
    // Use nextTick to avoid potential race conditions
    setTimeout(initEditor, 0);
  }
};

export default addTinyMce;
