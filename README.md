# Codefend user - frontend

## Entorno

Requisitos previos:

- Contar con la version 22 de NodeJS (Encaso de no cumplirla cambiar actual o usar herramientas como
  nvm)
- Tener NPM o PNPM para instalar paquetes (Recomendacion usar PNPM menos propenso a fallas)
- Crear un archivo `.env` en el proyecto con el contenido de `example.env` preguntar por el valor de
  las variables

## Ejecutar proyecto

```
git clone https://github.com/codefen/codefend-user
npm install
npm start
```

## :file_folder: Estructura del proyecto

```shell
/
├── .github/                  # GitHub workflow
├── .husky/                   # Husky Hooks
├── public/                   # Public assets folder (images, fonts, some scripts)
├── src/
│   ├── app/
│   │   ├── constants/        # App constants and global texts
│   │   ├── data/             # Data layer folder (hooks, interfaces, services, mocks and utils)
│   │   ├── router/           # React router
│   │   ├── views/            # React components (Components, Pages, Layouts, Styles and Contexts)
│   └── editor-lib/           # TinyMCE utils and types
├── src-tauri/                # Tauri folder with rust code for desktop version
├── codefend.bat              # .bat file with npm start script
├── commitlint.config.cjs     # Commitlint config (Library for validate commits)
├── cspell.json               # CSPELL config (Library for validate typos)
├── eslint.config.mjs         # New eslint config
├── lint-staged.config.mjs    # Lintstaged config (Library for execute scripts on files in git-staged)
├── setup-husky.js            # Custom script to start husky
├── stylelint.config.cjs      # Stylelint config (Library for css linting)
├── README.md                 # README file
└── tsconfig.json             # TypeScript configuration
```
