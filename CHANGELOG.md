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
