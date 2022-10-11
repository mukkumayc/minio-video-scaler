/* eslint-env node */
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const prettierConfigStandard = require("prettier-config-standard");

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const { endOfLine, useTabs, tabWidth, printWidth, ...rest } =
	prettierConfigStandard;

module.exports = {
	...rest,
	plugins: ["@trivago/prettier-plugin-sort-imports"],
	importOrderParserPlugins: [
		"typescript",
		'["decorators", { "decoratorsBeforeExport": true }]',
	],
	importOrder: ["^[./]"],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
};
