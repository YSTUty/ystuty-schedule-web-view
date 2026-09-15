# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://www.conventionalcommits.org/) for commit guidelines.

## [0.3.6](https://github.com/YSTUty/ystuty-viewer-frontend/compare/v0.3.5...v0.3.6) (2026-09-15)

### 🚀 Features

* **rate-limit:** add dismissible recovery notice ([a354666](https://github.com/YSTUty/ystuty-viewer-frontend/commit/a35466608c99d7c2925f5fd1b4344bee31773ba0))
* **schedule:** cache data and show its source ([0629b28](https://github.com/YSTUty/ystuty-viewer-frontend/commit/0629b287788bc6657e6b8b21fe832e535214d3b1))
* **schedule:** cache recent requests in memory ([b10c4c2](https://github.com/YSTUty/ystuty-viewer-frontend/commit/b10c4c2b77a2377d6142d1c3bcb8d936c8819fb9))
* **teachers:** show ids in selector ([84055a5](https://github.com/YSTUty/ystuty-viewer-frontend/commit/84055a58f4f023c1aa72a8f355e805fbb91b4024))
* **telegram:** prevent mini app zoom ([5ed61e1](https://github.com/YSTUty/ystuty-viewer-frontend/commit/5ed61e110a39c6e0f59a52c46a3c91bc52e5a300))

### 🐛 Bug Fixes

* **calendar:** disable incompatible appointment form ([75f337c](https://github.com/YSTUty/ystuty-viewer-frontend/commit/75f337ce709a73117603d32698fdd69e4af187ac))
* **deps:** update security patches ([fd8ba30](https://github.com/YSTUty/ystuty-viewer-frontend/commit/fd8ba303e5ca6b15319c06d6de4443aef17d53e0))
* **deps:** update vulnerable packages ([00afa4e](https://github.com/YSTUty/ystuty-viewer-frontend/commit/00afa4e78d0fa73222c6e2b01e1f5f1c03f9de7d))
* **selectors:** prevent cache tooltip from blocking dropdowns ([318aeb6](https://github.com/YSTUty/ystuty-viewer-frontend/commit/318aeb66e8b03cce1bcaebe1d5f9dc573fd952e9))
* **teacher-lessons:** improve mobile table layout ([d34aeb3](https://github.com/YSTUty/ystuty-viewer-frontend/commit/d34aeb313ab73a6a18dddf9381cba149eb54dacf))

## [0.3.5](https://github.com/YSTUty/ystuty-viewer-frontend/compare/v0.3.4...v0.3.5) (2026-09-15)

### 🚀 Features

* **api:** handle rate limits and add system log ([618c422](https://github.com/YSTUty/ystuty-viewer-frontend/commit/618c4225e3cf2b841a3d4f3037e8cf6a7acecd47))
* **api:** show rate limit countdown ([a34eb6b](https://github.com/YSTUty/ystuty-viewer-frontend/commit/a34eb6b051aa4d538e67098db89c0b6c88dc91b8))
* **cache:** move schedule data to indexeddb ([aacec4b](https://github.com/YSTUty/ystuty-viewer-frontend/commit/aacec4bd576d34408851bc8fe2e8a3b93da46caa))
* **teacher-lessons:** add academic period filter ([8aca1c6](https://github.com/YSTUty/ystuty-viewer-frontend/commit/8aca1c6dfe1c03639d5ea7204dc611e8f5e5c1a5))
* **teacher-lessons:** add period filter and fallback counts ([9b6af0f](https://github.com/YSTUty/ystuty-viewer-frontend/commit/9b6af0fbb108f75555d0f23d09c47e621d6fac14))
* **telegram:** add mini app sdk integration ([26b6d4f](https://github.com/YSTUty/ystuty-viewer-frontend/commit/26b6d4f02c1a91cd577f4841594ac2b0882df7d2))
* **telegram:** restore last mini app route ([13ce9dd](https://github.com/YSTUty/ystuty-viewer-frontend/commit/13ce9dd312a561f1245bde89c7c0b7168a6a44f4))
* **ui:** add not found page ([12547a2](https://github.com/YSTUty/ystuty-viewer-frontend/commit/12547a2bd87be3989ddaecb509c8033547120442))

### 🐛 Bug Fixes

* **ci:** load pages environment variables ([59f4363](https://github.com/YSTUty/ystuty-viewer-frontend/commit/59f43635e0e80727a88719b45ee1de61f12336e2))
* **telegram:** preserve paper color after app resume ([30d913b](https://github.com/YSTUty/ystuty-viewer-frontend/commit/30d913b08ee519b07a276b0dd0c578a17e351c2d))
* **ui:** reduce mobile header title size ([3fa4deb](https://github.com/YSTUty/ystuty-viewer-frontend/commit/3fa4debaaed1425dc827b42212bc96a13df81b2e))
* **ui:** show loading placeholder for lazy routes ([b6185b2](https://github.com/YSTUty/ystuty-viewer-frontend/commit/b6185b2b21a575f3cadf9ae697cb35555a791c94))
* **vk:** prevent duplicate like widget initialization ([3906673](https://github.com/YSTUty/ystuty-viewer-frontend/commit/39066733513acb31555b140b40e045f76d443547))

### ☯ Styling

* format project sources ([75bf774](https://github.com/YSTUty/ystuty-viewer-frontend/commit/75bf7742218241001e33dc7c73ccdc055dfd1657))

### 🔧 Code Refactoring

* **routing:** move teacher lessons selection to path ([da9d73d](https://github.com/YSTUty/ystuty-viewer-frontend/commit/da9d73df3729906e1430be4b04c694d1dc917226))

### 🛠️ CI

* add build and test workflow ([d4cade0](https://github.com/YSTUty/ystuty-viewer-frontend/commit/d4cade00cccf545ddb5f576fe577f225b4900e6e))
* deploy main branch to github pages ([dad021b](https://github.com/YSTUty/ystuty-viewer-frontend/commit/dad021be2017beb99dab80060ec7d9daca445703))
* **pages:** configure deployment variables ([240ab2c](https://github.com/YSTUty/ystuty-viewer-frontend/commit/240ab2c24c242c5a6c629b9d6e011c6782cf4b7d))
* use public registry url in yarn lock ([d6d9499](https://github.com/YSTUty/ystuty-viewer-frontend/commit/d6d94994985a36eb4130d12e999a61baafaddefe))

## [0.3.4](https://github.com/YSTUty/ystuty-viewer-frontend/compare/v0.3.3...v0.3.4) (2026-09-11)

### 🧹 Chore

* **app:** disable check pwa instruction ([b60b22e](https://github.com/YSTUty/ystuty-viewer-frontend/commit/b60b22e9485ad56625b10525bb3ecfa2f41486ee))
* **deploy:** update script ([7ed247b](https://github.com/YSTUty/ystuty-viewer-frontend/commit/7ed247bbff21ed94d2596e50929b28c6923da976))
* **env:** add internal api url ([cf8aa9b](https://github.com/YSTUty/ystuty-viewer-frontend/commit/cf8aa9bd1c3025863137e843e3c82124064511db))
* **prettier:** format ([9d381c2](https://github.com/YSTUty/ystuty-viewer-frontend/commit/9d381c29150107de42d12df49f05cdd1f4580383))
* **tsconfig:** up `target` to `es2019` ([9cf2b01](https://github.com/YSTUty/ystuty-viewer-frontend/commit/9cf2b01fa1534d18dc855ae760c22931cf300251))
* **types:** enforce stricter ts checks ([52ea8cc](https://github.com/YSTUty/ystuty-viewer-frontend/commit/52ea8ccd8cf590bf5e9dd662b0999be784956627))
* **version.json:** rename field `v` to `version` ([d87dd91](https://github.com/YSTUty/ystuty-viewer-frontend/commit/d87dd91002b41c018ec8ffa96e3edefccacda188))

### 🚀 Features

* **scheduler:** show `subInfo` flag and render link in tooltip ([e728039](https://github.com/YSTUty/ystuty-viewer-frontend/commit/e72803969138f7dad9d45a6f1b320910ccd137d1))

### 🐛 Bug Fixes

* **api:** guard endpoint urls and request cleanup ([d48f080](https://github.com/YSTUty/ystuty-viewer-frontend/commit/d48f08056ba5749c5ed745bfc0e1f1ab6320aa07))
* **api:** prevent stale api endpoint overrides ([1566b12](https://github.com/YSTUty/ystuty-viewer-frontend/commit/1566b12d15830d97553aabbef493e3678e066cee))
* **app:** guard persisted selections and vk init ([8563f3e](https://github.com/YSTUty/ystuty-viewer-frontend/commit/8563f3e44f53d3d030ee086159b43663a3b34aa2))
* **vite:** resolve mui icons from esm modules ([21e3cf9](https://github.com/YSTUty/ystuty-viewer-frontend/commit/21e3cf94319efe0f35d1cc5430a67d4bb151c569))

### 🔧 Code Refactoring

* **api:** simplify response error handling ([d6dac00](https://github.com/YSTUty/ystuty-viewer-frontend/commit/d6dac00f0f8e37de3df890ef8078bc660d21e1a0))
* **app:** consolidate shared ui behavior ([d582f3a](https://github.com/YSTUty/ystuty-viewer-frontend/commit/d582f3a47456f136a1fd865de4c9e884c45009b1))
* **app:** modernize routing and mui ([630aeca](https://github.com/YSTUty/ystuty-viewer-frontend/commit/630aeca8de28be68b4618d03c996c26748db3d07))
* **bootstrap:** separate app startup and provider tree ([40cf709](https://github.com/YSTUty/ystuty-viewer-frontend/commit/40cf709f142290706d5a539eae309186aae0b56d))
* **react:** migrate app to version 18 ([dc565ac](https://github.com/YSTUty/ystuty-viewer-frontend/commit/dc565ac014cd809e242e32b9388c043b92f5c8af))
* **router:** migrate routes to v6 ([ba273bc](https://github.com/YSTUty/ystuty-viewer-frontend/commit/ba273bc10f006830e26ded436b9ef89fdeead3a5))
* **vite:** standardize tooling and module imports ([add67d8](https://github.com/YSTUty/ystuty-viewer-frontend/commit/add67d801f5d8a6084973de472988c3a1e786b52))

### 🔨 Build System

* **release:** migrate to release-it ([91803f1](https://github.com/YSTUty/ystuty-viewer-frontend/commit/91803f1febdc3d33e0da6624b55e1ee340cdd211))
* **tooling:** enhance vite workflow and version checks ([04bc00a](https://github.com/YSTUty/ystuty-viewer-frontend/commit/04bc00a2bafa3205b267eb71ff8cafac9f0ddeb0))
* **vite:** migrate app from webpack to vite ([a8df041](https://github.com/YSTUty/ystuty-viewer-frontend/commit/a8df0419a245781c81b16fda10879516a6bdf297))
* **vite:** refine build configuration and deployment versioning ([341efa9](https://github.com/YSTUty/ystuty-viewer-frontend/commit/341efa94b0788f78df862813a985dc7d3271c638))

### [0.3.3](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.3.2...v0.3.3) (2025-04-03)


### 🚀 Features

* add hawk webpack plugin and sentry ([b739ecb](https://github.com/YSTUty/ystuty-schedule-web-view/commit/b739ecbdf46d339b97cb6122c5fb56706a77eaba))


### 📈 Chore

* **component:** add correct sorted groups for option `SelectGroup` ([7de4b67](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7de4b67aa80f89f893ef717c38111720462fc7ac))
* **project:** eject react-scripts ([149ba9b](https://github.com/YSTUty/ystuty-schedule-web-view/commit/149ba9bd6d9272c7c86ced3eaf7ff28e9e511d6f))
* **schedule:** add display `isDistant` for title ([69a949c](https://github.com/YSTUty/ystuty-schedule-web-view/commit/69a949cf74399ec21df9f5c83640e4715af2265a))
* **shared:** add correct catch for `checkNewDomain`; add reseting `resAttempts` ([dfed77b](https://github.com/YSTUty/ystuty-schedule-web-view/commit/dfed77b17a9225e844511805c30e67ec15ec42a7))
* temporarily rename scripts folder ([a9fff5d](https://github.com/YSTUty/ystuty-schedule-web-view/commit/a9fff5d0232c80ee186f86c46f4def5ff7ef7f39))

### [0.3.2](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.3.1...v0.3.2) (2025-04-02)


### 📈 Chore

* **page:** update text on main page ([7f79dfe](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7f79dfe37038bf88e752dfdf06d3cb3249e5c9fd))
* **shared:** update check app version function ([d2bd089](https://github.com/YSTUty/ystuty-schedule-web-view/commit/d2bd089d0c40a59e13b8522e2f629bca8f6c3033))
* **store:** rename variables ([f8f9fdc](https://github.com/YSTUty/ystuty-schedule-web-view/commit/f8f9fdca231630e858a66dbbf7e64b5a85ff031d))


### 🐛 Bug Fixes

* **page:** fix incorrect `scheduleFor` by path; set default as `null` ([97b1679](https://github.com/YSTUty/ystuty-schedule-web-view/commit/97b167984cf4aece5872e82ca7f3eea096895209))
* typo in lesson type name ([6010d07](https://github.com/YSTUty/ystuty-schedule-web-view/commit/6010d07d27c6ab4c891bb4287f362a395bc31cb0))


### 🚀 Features

* add `commitlint` ([6cdc9cd](https://github.com/YSTUty/ystuty-schedule-web-view/commit/6cdc9cd16399711eb6aa5a0205965c3f70ec78db))
* add deploy script ([2b42561](https://github.com/YSTUty/ystuty-schedule-web-view/commit/2b42561a5ae0644c788fa5fa8220bae6a3f0e297))
* add link to support ([90f6cff](https://github.com/YSTUty/ystuty-schedule-web-view/commit/90f6cff054e1f263667a7f57f395d4207102517c))
* **api:** add api fn and toastify ([1886783](https://github.com/YSTUty/ystuty-schedule-web-view/commit/188678393944c7af06bec3ee19a8df9184d3fc67))

### [0.3.1](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.3.0...v0.3.1) (2024-03-18)


### 📈 Chore

* **container:** add support `additionalAuditoryName` ([7252967](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7252967291cede6d9d0db283b9fb5f28db579265))
* display lessons with `Unsupported` type ([a28b3f4](https://github.com/YSTUty/ystuty-schedule-web-view/commit/a28b3f40b7620244915a9c754018c7747566b536))
* **project:** update structure ([61bda6f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/61bda6fc2577ddf54b5bedd6a65a01ab1b3c5819))
* **schedule:** add `ru` locale for schedule viwes ([5677abe](https://github.com/YSTUty/ystuty-schedule-web-view/commit/5677abe1e91a0c917c497e7d4ff8a45762dea07f))


### 🚀 Features

* add schedule for `audiences` ([f2adef9](https://github.com/YSTUty/ystuty-schedule-web-view/commit/f2adef9027f41e3ce15386df50ec0c6c6964fffc))
* combine into one schedule component ([a8796be](https://github.com/YSTUty/ystuty-schedule-web-view/commit/a8796beb23854cb4aa49196f5a1b9ecbcd8b584b))

## [0.3.0](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.7...v0.3.0) (2024-03-18)


### 🐛 Bug Fixes

* **components:** update multiple field state ([dc3c089](https://github.com/YSTUty/ystuty-schedule-web-view/commit/dc3c089f1568d13f76bf1b218dc94d73fb4bd213))
* **components:** update multiple field state for `teacher` ([030ebdd](https://github.com/YSTUty/ystuty-schedule-web-view/commit/030ebdd9698a8736f301ccdf4de946a3186a069f))


### 🚀 Features

* **public:** add meta `keywords` ([305bbb3](https://github.com/YSTUty/ystuty-schedule-web-view/commit/305bbb398f75e06c1699b573dd1eb1c7d9dfbe3b))
* **schedule:** update to new api version ([fa82c8c](https://github.com/YSTUty/ystuty-schedule-web-view/commit/fa82c8c98aafca3cfca0d0b43db73f48f0cfc3c7))


### 📈 Chore

* **app:** temporarily disabling `audience` page ([1e9855b](https://github.com/YSTUty/ystuty-schedule-web-view/commit/1e9855bae2d18837dc03dcea6b730d52f47c0b1c))
* change emoji for `chore` type ([214f1b6](https://github.com/YSTUty/ystuty-schedule-web-view/commit/214f1b60f9f38232c12abab10fc7d689644c8cd7))
* **deps:** update `[@hawk](https://github.com/hawk).so/javascript` ([c468fd7](https://github.com/YSTUty/ystuty-schedule-web-view/commit/c468fd71197148017b6a3a8a037332c9140861a8))
* **interfaces:** remove unnecessary interfaces for `teacher` ([7d9cc4f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7d9cc4fe96f6f9c6b43a2a7942743cc35941d76a))
* **interfaces:** update ([fd077cd](https://github.com/YSTUty/ystuty-schedule-web-view/commit/fd077cd2faf28e46fd169e2a13d1a2cd2b5879a6))
* **readme:** update api info ([79e26d9](https://github.com/YSTUty/ystuty-schedule-web-view/commit/79e26d933e69405317762d6edd7d2163065cc156))
* **sw:** add force updating client without ask ([754d404](https://github.com/YSTUty/ystuty-schedule-web-view/commit/754d404d47f8bde52dbdb6c9581a754c0b7d6ff4))
* **theme:** disabple speedy for emotion cache css ([ef9982b](https://github.com/YSTUty/ystuty-schedule-web-view/commit/ef9982b7a171f2c75bd7efb625a6e3e689cb0275))
* update `.editorconfig` ([7f2a06f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7f2a06f28b6486d539b04fd6132073a693402974))
* update store cached keys prefix ([7f71c90](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7f71c902794707cac7d2ff231a27b476b6be644c))

### [0.2.7](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.6...v0.2.7) (2024-02-27)


### 🧹 Chore

* add remover utms from query ([fdf2f3b](https://github.com/YSTUty/ystuty-schedule-web-view/commit/fdf2f3bfa88cb96c6418d62af50e3e952c5c851d))
* **deps:** update `@types/node` & `react-yandex-metrika` ([4472b00](https://github.com/YSTUty/ystuty-schedule-web-view/commit/4472b00abd41ed898b8d406dfd7e1a64dcf4914b))

### [0.2.6](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.5...v0.2.6) (2024-02-21)


### 🧹 Chore

* **deps:** update `node-sass` ([e33c10b](https://github.com/YSTUty/ystuty-schedule-web-view/commit/e33c10b73c7c3bbfc16121137b3be04c831fc0b6))
* fix typos and types ([607fb88](https://github.com/YSTUty/ystuty-schedule-web-view/commit/607fb888587de1b03f582d8b5f2813cfdacb7181))
* **util:** add cleanup local cache for schedule ([7e68f66](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7e68f66f9b2427e3a7992005734d1b8cac0c870d))

### [0.2.5](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.4...v0.2.5) (2023-09-11)


### 🐛 Bug Fixes

* **readme:** change server host on badges ([f59e34a](https://github.com/YSTUty/ystuty-schedule-web-view/commit/f59e34aa4186de7ff2159ae8d2f9d03b70f12a01))


### 🚀 Features

* **app:** add links to schedule bot on messengers ([26cfd10](https://github.com/YSTUty/ystuty-schedule-web-view/commit/26cfd10738c79a263ca57e50ea6ff2392c676a07))
* **routes:** add support group name in `pathname` ([adbf72f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/adbf72f0cdd00165eee9ab4519dcce9ad9fd96c3))


### 🧹 Chore

* **containers:** remove `hr` tag ([de48ffe](https://github.com/YSTUty/ystuty-schedule-web-view/commit/de48ffeffd7f806b7d9fbe35fea88d03da7ced8b))
* **project:** rename project to `ystuty-schedule-web-view` ([af394a8](https://github.com/YSTUty/ystuty-schedule-web-view/commit/af394a8cbfdd066daab827b9e1c43f93b358d641))

### [0.2.4](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.3...v0.2.4) (2023-03-09)


### 🚀 Features

* add audience month stat ([fd89346](https://github.com/YSTUty/ystuty-schedule-web-view/commit/fd89346ef6952cf57c366feac6db57df1b144b57))
* add filter by lesson type to audiencer ([411fe75](https://github.com/YSTUty/ystuty-schedule-web-view/commit/411fe75a29fa878fc6818f816b24e4d08494f74e))
* add filter debounce linear progress ([26e440e](https://github.com/YSTUty/ystuty-schedule-web-view/commit/26e440e5d417e3cba5c271f78401a620415017b7))
* add new `LessonFlags` ([6912174](https://github.com/YSTUty/ystuty-schedule-web-view/commit/6912174a1399f50cf07084b6c178218398ae5dee))
* **scheduler:** add support `allDay` for exam ([b35e1e6](https://github.com/YSTUty/ystuty-schedule-web-view/commit/b35e1e6b6c482875802db6f835ac5d28644f74ab))


### 🧹 Chore

* **audiencer:** add milti filter ([eaf3e7a](https://github.com/YSTUty/ystuty-schedule-web-view/commit/eaf3e7a9073ef91488b903b9569dc9a05eea7cf6))
* **env:** add support for custom api path ([e7cf3cf](https://github.com/YSTUty/ystuty-schedule-web-view/commit/e7cf3cff757a0d5e5a17ba8f65f3e18ae863b57a))
* unified page id for vk like ([677e0a3](https://github.com/YSTUty/ystuty-schedule-web-view/commit/677e0a387ff9e45f66a6c1d1e92053b2b14d8ae7))
* update locale ([2e8d668](https://github.com/YSTUty/ystuty-schedule-web-view/commit/2e8d6684dd9db94fb8fa2dab12e2de1c1066fbeb))

### [0.2.3](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.2...v0.2.3) (2022-12-12)


### 🧹 Chore

* **audiencer:** updated table padding by breakpoints ([0a3b4d0](https://github.com/YSTUty/ystuty-schedule-web-view/commit/0a3b4d03f65939e5e65b1aa4cd1f93316aca5ad1))


### 🚀 Features

* **audiencer:** updated filter displaying & moved to utils ([4c346ec](https://github.com/YSTUty/ystuty-schedule-web-view/commit/4c346ec9c04213797ea1fe97a5ce3a3cb0e9ef98))

### [0.2.2](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.1...v0.2.2) (2022-12-12)


### 🚀 Features

* added pulsation animation for input component ([ce1b4e9](https://github.com/YSTUty/ystuty-schedule-web-view/commit/ce1b4e9b7bbdab57e6f5f27577a43a1971b4bf33))
* **app:** added `vk like` widget ([e411fee](https://github.com/YSTUty/ystuty-schedule-web-view/commit/e411fee5075c259b0dc17f4595c170089540a995))
* updated app bar (toolbar) ([9101b7c](https://github.com/YSTUty/ystuty-schedule-web-view/commit/9101b7c5f228bf1e1ef6177686a34780a85aee29))

### [0.2.1](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.2.0...v0.2.1) (2022-10-28)


### 🐛 Bug Fixes

* **components:** added a missing lesson flag in array ([bdd6e99](https://github.com/YSTUty/ystuty-schedule-web-view/commit/bdd6e991c3cda3c370c1a59112b90103382b1e27))


### 🚀 Features

* added `teacher-lessons` ([91351be](https://github.com/YSTUty/ystuty-schedule-web-view/commit/91351be70ec658b4b4de9d1be8a9ff46cf871995))
* **app:** updated main page buttons style ([084e80a](https://github.com/YSTUty/ystuty-schedule-web-view/commit/084e80ac3ec13be4a0a1c15c18aa5cab863431b6))


### 🧹 Chore

* moved `constants` to `envUtils` ([227fbf7](https://github.com/YSTUty/ystuty-schedule-web-view/commit/227fbf71d8d37876e109e7702db985997e84df14))
* **teacher-lessons:** added color by lesson type ([fabeb93](https://github.com/YSTUty/ystuty-schedule-web-view/commit/fabeb9388007a35940aef99cf5f297b51582ebf5))

## [0.2.0](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.1.10...v0.2.0) (2022-10-03)


### 🐛 Bug Fixes

* **components:** fixed selection of groups and teachers ([d0f5a0e](https://github.com/YSTUty/ystuty-schedule-web-view/commit/d0f5a0e3c7e3b4bfe9bd4ff41a521614dabfe49e))
* **components:** fixed selection of groups and teachers empty value ([789bb74](https://github.com/YSTUty/ystuty-schedule-web-view/commit/789bb746090180e44122a0dea5888478f20f9652))


### 🚀 Features

* added `prettier` and `editorconfig` ([2334237](https://github.com/YSTUty/ystuty-schedule-web-view/commit/23342378d2b50e15984de441b81f8f4ec20d0e9a))
* added copyright to all pages ([417ba62](https://github.com/YSTUty/ystuty-schedule-web-view/commit/417ba6226d1a9d9702677139ccf1f4ef79b13eb5))
* **app:** added welcome page ([239cc0e](https://github.com/YSTUty/ystuty-schedule-web-view/commit/239cc0e1b0861058bac03ff186873d617a34b97e))
* **audience:** added combined schedule table ([7d3197d](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7d3197dd4a4cb1cc7272eaa1e182f3468e37196a))
* **audience:** added displaying all audiences ([683680b](https://github.com/YSTUty/ystuty-schedule-web-view/commit/683680b83c32dbf6cc8d28840612ad552aa097bf))
* **audience:** split filter code to filter provider ([73daa4f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/73daa4f594a5633f2f2d0fef843d7e3f4da7324c))
* updated readme ([f98d7ca](https://github.com/YSTUty/ystuty-schedule-web-view/commit/f98d7cab207c46f42ac9721f9988bb70542eafd4))


### 🧹 Chore

* **beta:** moved `beta` status from `teacher` to `audiencer` ([7d8064d](https://github.com/YSTUty/ystuty-schedule-web-view/commit/7d8064d01efb15bb197a24e8f2b30d99fd024ef5))
* **datetimepicker:** correct `min` and `max` value ([21f5d08](https://github.com/YSTUty/ystuty-schedule-web-view/commit/21f5d08dfa389ab46d95d66ad4775e518cd7419e))
* **eslint:** clean code ([40c7329](https://github.com/YSTUty/ystuty-schedule-web-view/commit/40c73294fcd5f7abff66c4dbfa1bff6c790ade2d))
* **filter:** correct formation of date interval ([6f74c2f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/6f74c2f25b201cf379bea1f1340ffce6ce68b95e))
* **filter:** updated component value and label ([b05916e](https://github.com/YSTUty/ystuty-schedule-web-view/commit/b05916ed82e086a8d3c9cccde19e9098914e217f))
* removed `fullcalendar` module and component ([1cdd253](https://github.com/YSTUty/ystuty-schedule-web-view/commit/1cdd2538c5d5fc22535ee7bfac1201c17661106d))
* removed old script ([76a238d](https://github.com/YSTUty/ystuty-schedule-web-view/commit/76a238d6e2435365cc39684caf497b46beb053e5))
* **schedule:** removed default group value ([8369eb5](https://github.com/YSTUty/ystuty-schedule-web-view/commit/8369eb5d664736bde8b9914e5d6ce4f840747ca9))
* **schedule:** updated size ([9e6d47f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/9e6d47f3d900fb2e4266a01776aa7d19fd3e0940))

### [0.1.10](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.1.9...v0.1.10) (2022-09-02)


### ☯ Styling

* **schedule:** updated group schedule style ([09dd991](https://github.com/YSTUty/ystuty-schedule-web-view/commit/09dd991bcde920ff352ec994d62dbb4644642d12))


### 🚀 Features

* **schedule:** added `title` attr for appointment content ([23a3e6d](https://github.com/YSTUty/ystuty-schedule-web-view/commit/23a3e6ddc1d1c5f7fa1f626577a4cb0bfa72a231))
* **schedule:** added saving array of last selection ([026e56f](https://github.com/YSTUty/ystuty-schedule-web-view/commit/026e56fcafec6c051354edc5ec035690371e243d))
* **schedule:** added support teacher grouping ([db103ce](https://github.com/YSTUty/ystuty-schedule-web-view/commit/db103ce8f0fb7abbd8ac378107a4cb6d2aec9115))

### [0.1.9](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.1.8...v0.1.9) (2022-09-02)


### 🧹 Chore

* added global `alertMe` fn ([47acd0a](https://github.com/YSTUty/ystuty-schedule-web-view/commit/47acd0adc8ec73fcd80e292f572f5dff10f01dfe))
* **components:** optimized content size for mobile ([54be34e](https://github.com/YSTUty/ystuty-schedule-web-view/commit/54be34e2313eebb8ae91e85565efff21f85e642f))
* **deps:** removed `react-big-calendar` ([b9b94db](https://github.com/YSTUty/ystuty-schedule-web-view/commit/b9b94db3107dbe508b7dc57bc53cd3afd0c54fec))
* **deps:** updated ([5079a2c](https://github.com/YSTUty/ystuty-schedule-web-view/commit/5079a2c3e87bd842fbde07236d23cd3d70b0d785))
* **deps:** updated ([96ff411](https://github.com/YSTUty/ystuty-schedule-web-view/commit/96ff411ea2747bc2684bb7b0f79f632cc19cdc8e))
* **deps:** updated `react-yandex-metrika` ([9a87a83](https://github.com/YSTUty/ystuty-schedule-web-view/commit/9a87a8331d67ef7e0778ff54bafdcea9c6163907))
* **package:** removed `homepage` ([6a07e05](https://github.com/YSTUty/ystuty-schedule-web-view/commit/6a07e057bfcf8fb637faa3d2af820633eb12a162))
* **readme:** added budge for teachers ([d090bcd](https://github.com/YSTUty/ystuty-schedule-web-view/commit/d090bcdf3e7d937a98756130313f2f19bc8a1ad9))


### 🐛 Bug Fixes

* **component:** fixed mui component ref `caveat-with-refs` ([e89b1a6](https://github.com/YSTUty/ystuty-schedule-web-view/commit/e89b1a6000083b2501114f1364963116e4bad898))
* **schedule:** fixed deafult value ([d86332e](https://github.com/YSTUty/ystuty-schedule-web-view/commit/d86332ed19203f8d5ac9ea5d3ea3cde027b8ebb4))


### 🚀 Features

* added switching between teachers and groups ([d7476f0](https://github.com/YSTUty/ystuty-schedule-web-view/commit/d7476f06ccf4a6d66c7d1d512fafbd95928efa7e))
* **app:** added route for group schedule ([8088882](https://github.com/YSTUty/ystuty-schedule-web-view/commit/808888277472071d76422db375f140d6dc8aad0a))
* **components:** added saving last theme mode ([5ffb1e1](https://github.com/YSTUty/ystuty-schedule-web-view/commit/5ffb1e1582d4974c3a490258dafa299a2e0bb073))
* **teacher:** added schedule for teachers ([5cd3ee4](https://github.com/YSTUty/ystuty-schedule-web-view/commit/5cd3ee454cb1e96ef739aa63fac2b20daee0b3b2))

### [0.1.8](https://github.com/YSTUty/ystuty-schedule-web-view/compare/v0.1.7...v0.1.8) (2022-08-29)


### 🧹 Chore

* **component:** changed max number selected group ([11f3ed2](https://github.com/YSTUty/ystuty-schedule-web-view/commit/11f3ed20bcbf9d239219796c14884bdc824baff4))
* **deps:** update ([c354b78](https://github.com/YSTUty/ystuty-schedule-web-view/commit/c354b785d59c3f8d081d428118a189ef2d43afa4))


### 🚀 Features

* added license file ([e75a3fa](https://github.com/YSTUty/ystuty-schedule-web-view/commit/e75a3faea6ce5444e93dc307af0d21f94123efae))
* **project:** added main links and logo ([df38459](https://github.com/YSTUty/ystuty-schedule-web-view/commit/df384596a34dcf1cf884bdc73fd0263e3c239c12))
* **schedule:** added feature grouping multiple groups ([65f8f53](https://github.com/YSTUty/ystuty-schedule-web-view/commit/65f8f537d4f93887c5eb61f8fb3ef39c45c2b142))
* **schedule:** updated cells size month view ([634c014](https://github.com/YSTUty/ystuty-schedule-web-view/commit/634c014e94a745d2bc36ebc8a20b80c2f7de613b))
