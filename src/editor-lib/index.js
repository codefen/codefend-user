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
  content_style: `
    @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');
    @font-face {
      font-family: Satoshi;
      font-style: normal;
      font-weight: 400;
      src: url('/user-panel/fonts/Satoshi-Regular.otf') format('opentype');
    }
    @font-face {
      font-family: Satoshi;
      font-style: normal;
      font-weight: 500;
      src: url('/user-panel/fonts/Satoshi-Medium.otf') format('opentype');
    }
    @font-face {
      font-family: Satoshi;
      font-style: normal;
      font-weight: 700;
      src: url('/user-panel/fonts/Satoshi-Bold.otf') format('opentype');
    }
    :root, html {
      --line-color: #168cb5 !important;
      --primary-color-100: #168cb5 !important;
      --text-color-alt2: #168cb5 !important;
      --secondary-color: #168cb5 !important;
      --secondary-color-50: #168cb5 !important;
      --secondary-color-100: #087da4 !important;
      --secondary-color-200: #168cb5 !important;
      --code-bkg: #e8f6fb !important;
      --table-border-color: #d9e2e5 !important;
      --text-color: #20282d !important;
      --text-color-alt3: #46565e !important;
      --primary-color-300: #d9e2e5 !important;
      --primary-color-400: #eef5f7 !important;
      --primary-color-500: #e8eef0 !important;
    }
    body {
      font-family: Satoshi, Urbanist, system-ui, sans-serif !important;
      letter-spacing: 0 !important;
      font-size: 15px !important;
      line-height: 1.6 !important;
      color: #46565e !important;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3, h4 {
      font-family: Urbanist, Satoshi, system-ui, sans-serif !important;
      letter-spacing: 0.04em !important;
      font-weight: 700 !important;
      color: #20282d !important;
    }
    h3 {
      border-top: 1px solid #d9e2e5 !important;
      border-bottom: 1px solid #d9e2e5 !important;
      font-size: 13px !important;
      text-transform: uppercase !important;
      padding: 14px 0 12px !important;
      margin: 28px 0 18px !important;
    }
    p, li, td, th {
      font-family: Satoshi, Urbanist, system-ui, sans-serif !important;
    }
    p { margin-bottom: 1em !important; }
    li { line-height: 1.55 !important; }
    table, .leaks_grid {
      font-family: Satoshi, Urbanist, system-ui, sans-serif !important;
      font-size: 14px !important;
    }
    .leaks_grid td, .leaks_grid th {
      padding: 8px 12px !important;
      line-height: 1.45 !important;
    }
    hr {
      border: 0 !important;
      border-top: 1px solid #d9e2e5 !important;
      background: transparent !important;
      height: 0 !important;
      color: transparent !important;
    }
    b, strong, p a, li a { color: #168cb5 !important; }
    code { color: #086784 !important; background: #e8f6fb !important; font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important; }
    .leaks_grid thead, .leaks_grid th { color: #168cb5 !important; font-family: Urbanist, Satoshi, system-ui, sans-serif !important; font-weight: 650 !important; }
    .leaks_grid hr {
      background-color: #168cb5 !important;
      color: #168cb5 !important;
      opacity: 0.35 !important;
    }
    * { scrollbar-color: #9bbcc8 #fff !important; }
    ::-webkit-scrollbar-thumb { background: #9bbcc8 !important; border-radius: 8px !important; }
    ::-webkit-scrollbar-thumb:hover { background: #168cb5 !important; }
  `,
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
            content_style: isDarkMode
              ? `
              @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');
              @font-face { font-family: Satoshi; font-style: normal; font-weight: 400; src: url('/user-panel/fonts/Satoshi-Regular.otf') format('opentype'); }
              @font-face { font-family: Satoshi; font-style: normal; font-weight: 500; src: url('/user-panel/fonts/Satoshi-Medium.otf') format('opentype'); }
              @font-face { font-family: Satoshi; font-style: normal; font-weight: 700; src: url('/user-panel/fonts/Satoshi-Bold.otf') format('opentype'); }
              :root, html {
                --line-color: #72d7f5 !important;
                --primary-color-100: #72d7f5 !important;
                --text-color-alt2: #72d7f5 !important;
                --secondary-color: #72d7f5 !important;
                --secondary-color-50: #72d7f5 !important;
                --secondary-color-200: #54b9da !important;
                --code-bkg: #10262e !important;
                --table-border-color: #2a3d45 !important;
                --text-color: #edf5f7 !important;
                --text-color-alt3: #bccbd0 !important;
                --primary-color-300: #2a3d45 !important;
              }
              body { font-family: Satoshi, Urbanist, system-ui, sans-serif !important; color: #bccbd0 !important; letter-spacing: 0 !important; font-size: 15px !important; line-height: 1.6 !important; -webkit-font-smoothing: antialiased; }
              h1, h2, h3, h4 { font-family: Urbanist, Satoshi, system-ui, sans-serif !important; letter-spacing: 0.04em !important; font-weight: 700 !important; color: #edf5f7 !important; }
              h3 { border-top: 1px solid #2a3d45 !important; border-bottom: 1px solid #2a3d45 !important; font-size: 13px !important; text-transform: uppercase !important; }
              p, li, td, th, table, .leaks_grid { font-family: Satoshi, Urbanist, system-ui, sans-serif !important; }
              .leaks_grid td, .leaks_grid th { padding: 8px 12px !important; }
              hr { border: 0 !important; border-top: 1px solid #2a3d45 !important; background: transparent !important; height: 0 !important; }
              b, strong, p a, li a, .leaks_grid th { color: #72d7f5 !important; }
              code { color: #72d7f5 !important; background: #10262e !important; font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important; }
              ::-webkit-scrollbar-thumb { background: #3d5a66 !important; }
            `
              : OPTIONS.content_style,
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
