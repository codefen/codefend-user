# Codefend panel - frontend

### *Instalation:*

```
git clone https://github.com/codefen/codefend-user
npm install
npm start
```

### *Run with Tauri*
*Dependencies: https://www.rust-lang.org/*

```
npm run tauri dev
```

### *Compile tauri*

```
npm run tauri build
```

### *Create priv and pub key for signing the Tauri app*

```
npm run tauri signer generate -- -w ~/.tauri/codefend.key
```


# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
