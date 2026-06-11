## [1.4.1](https://github.com/simiancraft/google-mcp-suite/compare/v1.4.0...v1.4.1) (2026-06-11)

# [1.4.0](https://github.com/simiancraft/google-mcp-suite/compare/v1.3.0...v1.4.0) (2026-06-11)


### Bug Fixes

* **lib:** make the capability link unconditional ([998a9bd](https://github.com/simiancraft/google-mcp-suite/commit/998a9bdfc2edb83338a49324ed21b657e5f92e40))


### Features

* cite the source reference page on every operation ([7fa46a2](https://github.com/simiancraft/google-mcp-suite/commit/7fa46a2a62afc351329f312ca5b1ee4f219bd04a))
* **lib:** serve provenance, identity metadata, and instructions ([c06d854](https://github.com/simiancraft/google-mcp-suite/commit/c06d8543a8a4917a540c49f3d567e278f95533b9))
* serve per-service instructions and identity metadata ([5ce7ccd](https://github.com/simiancraft/google-mcp-suite/commit/5ce7ccdf8a88839d1e0b750d7ef1a590df6875f8))

# [1.3.0](https://github.com/simiancraft/google-mcp-suite/compare/v1.2.0...v1.3.0) (2026-06-11)


### Features

* **calendar:** annotate every operation with the four MCP hints ([737eaef](https://github.com/simiancraft/google-mcp-suite/commit/737eaef76e17e6ac6594da21b29cb6452abe1272))
* **gmail:** annotate every operation with the four MCP hints ([2813fd4](https://github.com/simiancraft/google-mcp-suite/commit/2813fd44c15825b6846ed87d9653031e03147377))
* **lib:** carry MCP tool annotations on operations ([51d98bd](https://github.com/simiancraft/google-mcp-suite/commit/51d98bdf7d84ac3ae58eabc1505a498c64946f15))
* **sheets:** annotate every operation with the four MCP hints ([b26d65e](https://github.com/simiancraft/google-mcp-suite/commit/b26d65e156fdfa29aeee2c04f4c2bb49771dcee9))

# [1.2.0](https://github.com/simiancraft/google-mcp-suite/compare/v1.1.0...v1.2.0) (2026-06-11)


### Bug Fixes

* **calendar:** drop unknown reminder methods instead of coercing to popup ([b5f8aa3](https://github.com/simiancraft/google-mcp-suite/commit/b5f8aa3c7f3ef67606796a030e1dd04568bfa845))
* **calendar:** reject malformed working-hour bounds in suggestSlots ([87936da](https://github.com/simiancraft/google-mcp-suite/commit/87936da23d7edfe938104eb9b9c632399668a2af))
* **lib:** derive the capabilities header from the rendered groups ([6614b68](https://github.com/simiancraft/google-mcp-suite/commit/6614b688344069cbff69f0f5bb9f264119ab60a4))
* **lib:** guard operation dispatch against inherited Object keys ([52a1a96](https://github.com/simiancraft/google-mcp-suite/commit/52a1a960cd99896497091b1539dc2d1b82737651))
* **sheets:** drop the typographic apostrophe from copy_sheet's description ([9a5c89f](https://github.com/simiancraft/google-mcp-suite/commit/9a5c89fc279b0e2dfa6e9ed9d73d26581b8300e0))


### Features

* **doctor:** register sheets as implemented with a live probe ([c24140e](https://github.com/simiancraft/google-mcp-suite/commit/c24140ed6340c6f090a14e4b36c3771e6048df11))
* **sheets:** add the batch values operations ([913ec4c](https://github.com/simiancraft/google-mcp-suite/commit/913ec4ceed7d7214e9046e507c5bd02438a1f91a))
* **sheets:** add the data-filter values operations ([d06b175](https://github.com/simiancraft/google-mcp-suite/commit/d06b1755e86c1861deaa32cf1943d8d97d122e11))
* **sheets:** add the developer metadata operations ([dd8e8b3](https://github.com/simiancraft/google-mcp-suite/commit/dd8e8b37ebbb6b43ed174c1a5b0596847266212e))
* **sheets:** add the sheet copy operation ([38729c1](https://github.com/simiancraft/google-mcp-suite/commit/38729c10df6321a8358bf3d4d147250040cba996))
* **sheets:** add the spreadsheet and values read path ([6757dc7](https://github.com/simiancraft/google-mcp-suite/commit/6757dc7f35d8b6c5f332b19defc14d493b11f0ad)), closes [#28](https://github.com/simiancraft/google-mcp-suite/issues/28)
* **sheets:** add the spreadsheet and values write path ([99c6ac0](https://github.com/simiancraft/google-mcp-suite/commit/99c6ac03a0e2f96983e372a7763d1dd5f880b541))
* **sheets:** scaffold the sheets service skeleton ([fb3268f](https://github.com/simiancraft/google-mcp-suite/commit/fb3268f981d66b93ac5666e257cf32f08e9c7dab))

# [1.1.0](https://github.com/simiancraft/google-mcp-suite/compare/v1.0.0...v1.1.0) (2026-06-10)


### Bug Fixes

* **calendar:** refuse suggest_time on unreadable calendars; bound pageSize; lift Meet helper ([0ed36ca](https://github.com/simiancraft/google-mcp-suite/commit/0ed36ca454b22ec02ec971d0757b3228964a8f66))


### Features

* **calendar:** add availability and account methods (freebusy, colors, settings) ([fd69d85](https://github.com/simiancraft/google-mcp-suite/commit/fd69d85b4d3a0d346392dd3f3aebbab7a000a0fe)), closes [#21](https://github.com/simiancraft/google-mcp-suite/issues/21)
* **calendar:** add calendar entry methods (get, add, update, remove) ([95e99bc](https://github.com/simiancraft/google-mcp-suite/commit/95e99bc929c23d3d042f26fca17bfb4e996bc702))
* **calendar:** add calendar resource methods (get, create, update, delete, clear) ([c1c3532](https://github.com/simiancraft/google-mcp-suite/commit/c1c35329f8be00ade2323630144f92ab8b30dfc1))
* **calendar:** add event methods (instances, move, quickAdd, patch) ([5b07b59](https://github.com/simiancraft/google-mcp-suite/commit/5b07b59938da3e605d759fceb7b447f64d7d33fd))
* **calendar:** add event read tools (list_events, get_event) ([85ccd0e](https://github.com/simiancraft/google-mcp-suite/commit/85ccd0e2fa57590def7fd30c4db2fc9a76ca2b76))
* **calendar:** add event write tools (create, update, delete, respond) ([dd33a0a](https://github.com/simiancraft/google-mcp-suite/commit/dd33a0a83990f5ac654811b79ea9076562007bae))
* **calendar:** add list_calendars and suggest_time; 8-tool mirror complete ([e2d09d1](https://github.com/simiancraft/google-mcp-suite/commit/e2d09d16164e86ee3a6eb44f38bfc15a37d36627))
* **calendar:** scaffold the calendar service skeleton ([bfb67f2](https://github.com/simiancraft/google-mcp-suite/commit/bfb67f2798ca283d0ec50a9027efc7aa5ffe9b5a))
* **doctor:** register calendar as implemented with a live probe ([89d1ae7](https://github.com/simiancraft/google-mcp-suite/commit/89d1ae769850a477023fc600e67ede6af3e6ba3d))

# 1.0.0 (2026-06-10)


### Bug Fixes

* **ci:** build workspace dependencies before dependents ([b9f54f8](https://github.com/simiancraft/google-mcp-suite/commit/b9f54f8940bd38169b1e8df7b9749c2b5cc32a00))
* **gmail:** block header injection in compose; mark create_filter destructive ([6d10841](https://github.com/simiancraft/google-mcp-suite/commit/6d1084102c011ffcc28d7be04f8338652eece044))
* **gmail:** bound address and MIME parsing against hostile input ([ed1a87f](https://github.com/simiancraft/google-mcp-suite/commit/ed1a87f2915f39427babd8687475a980e0ea6952))
* **gmail:** parse address headers with addressparser ([f8f434b](https://github.com/simiancraft/google-mcp-suite/commit/f8f434b88e8adfcf9b8a4745d4a9cf0a3825d551))
* **lib:** source server version from package.json ([a796cfa](https://github.com/simiancraft/google-mcp-suite/commit/a796cfaa40d08a99df3a1b01266e5cd8131d2038))


### Features

* **auth:** add shared OAuth with per-account tokens ([8679e5a](https://github.com/simiancraft/google-mcp-suite/commit/8679e5aecf9f62db9c936646170674659f670e4a))
* **auth:** front-load the scope union for all planned services ([f90fe31](https://github.com/simiancraft/google-mcp-suite/commit/f90fe317c3812d4e02d2ff3720d54f60f9d9dd58))
* **doctor:** add provisioning and auth-health micro-CLI ([5172615](https://github.com/simiancraft/google-mcp-suite/commit/517261547ee45f3a87f857737b8aeb20e4c2fcd0))
* **gmail:** add filters, batch ops, and HTML body extraction ([229569b](https://github.com/simiancraft/google-mcp-suite/commit/229569b5dd65ea5dbd6b555178706f0f27f7e65a)), closes [#4](https://github.com/simiancraft/google-mcp-suite/issues/4) [#5](https://github.com/simiancraft/google-mcp-suite/issues/5)
* **gmail:** add list_labels tool with Label/LabelColor entities ([e81c096](https://github.com/simiancraft/google-mcp-suite/commit/e81c096f7e7ba75f6b148bd86ad701c59ccec979))
* **gmail:** add REST methods alongside MCP tools ([ccbb166](https://github.com/simiancraft/google-mcp-suite/commit/ccbb166eb651c4ff8e86c8928e2111de4862429e))
* **gmail:** add the remaining nine Tier-1 tools ([fcb1ae0](https://github.com/simiancraft/google-mcp-suite/commit/fcb1ae02214d188c6079aca3c80572bcf60036f9))
* **gmail:** bind operations to the Gmail client via gmailOperation ([0b2f989](https://github.com/simiancraft/google-mcp-suite/commit/0b2f9897a77ba44d830af2014e0a314479c56b4c))
* **gmail:** complete Batch 1 REST methods (parity) ([5f6bbd2](https://github.com/simiancraft/google-mcp-suite/commit/5f6bbd2e7df856137aef95d8104715741956cd91))
* **gmail:** compose messages with mail-mime-builder ([b87cd43](https://github.com/simiancraft/google-mcp-suite/commit/b87cd433ef37f43ae41ecfce86cac40ef9083fa6))
* **gmail:** generate CAPABILITIES.md and document the tool surface ([7210300](https://github.com/simiancraft/google-mcp-suite/commit/7210300c12b5eddef2c8a37422875ec397dbbdf6))
* **gmail:** project sender and recipients as structured EmailAddress ([6644648](https://github.com/simiancraft/google-mcp-suite/commit/6644648a4b12177845f985b1be727f089da3aed7))
* **gmail:** scaffold the service shell ([8dabeee](https://github.com/simiancraft/google-mcp-suite/commit/8dabeee8738dd3f546db4fdd080ef7ad7a1ba21b))
* **gmail:** tighten zod on forwarding address and label colors ([1cb1c65](https://github.com/simiancraft/google-mcp-suite/commit/1cb1c6559afc2eadd0f6adf6ebc568070bae3285))
* **harness:** add shared tool factory and server ([ae9a2bf](https://github.com/simiancraft/google-mcp-suite/commit/ae9a2bfbbb31b527ffd92cc6d7ecfd008da6cfd6))
* **harness:** render a registry as a Markdown capability table ([11b4a7b](https://github.com/simiancraft/google-mcp-suite/commit/11b4a7b736f8dd66c9708fa08e3ca08e2f28472b))
* **lib:** add a Source column to the capability table ([8fa201b](https://github.com/simiancraft/google-mcp-suite/commit/8fa201b9256872cb5688359080cad9c0919f77db))
* **lib:** add Optional type and the forGoogle boundary adapter ([fc56f1b](https://github.com/simiancraft/google-mcp-suite/commit/fc56f1bcf16d2f1ee08ed969374404c80c2d178c))
* **lib:** reject duplicate wire names when merging operations ([947a06f](https://github.com/simiancraft/google-mcp-suite/commit/947a06ff45fb276ccd42b16ce5a95df3a02b7f80))


### Performance Improvements

* **gmail:** bound list fan-out (fix eager over-fetch) ([3c66f47](https://github.com/simiancraft/google-mcp-suite/commit/3c66f479341310854aa95d4ae4ab2ea7315108b4))
* **gmail:** memoize sender address per client (no dataloader) ([2d41ea5](https://github.com/simiancraft/google-mcp-suite/commit/2d41ea55cac025b4dd6a9be99c58ac70181caec9))
