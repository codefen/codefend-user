# Codefend user - frontend

### _Instalation:_

```
git clone https://github.com/codefen/codefend-user
npm install
npm start
```

### _Run with Tauri_

_Dependencies: https://www.rust-lang.org/_

```
npm run tauri dev
```

### _Compile tauri_

```
npm run tauri build
```

### _Create priv and pub key for signing the Tauri app_

```
npm run tauri signer generate -- -w ~/.tauri/codefend.key
```

# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) +
  [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
  [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
