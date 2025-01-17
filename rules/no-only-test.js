'use strict';

const {visitIf} = require('enhance-visitors');
const createAvaRule = require('../create-ava-rule');
const util = require('../util');

const create = context => {
	const ava = createAvaRule();

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isTestNode,
		])(node => {
			const propertyNode = util.getTestModifier(node, 'only');
			if (propertyNode) {
				context.report({
					node: propertyNode,
					message: '`test.only()` should not be used.',
					suggest: [{
						desc: 'Remove the `.only`',
						fix: fixer => fixer.replaceTextRange.apply(null, util.removeTestModifier({
							modifier: 'only',
							node,
							context,
						})),
					}],
				});
			}
		}),
	});
};

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: util.getDocsUrl(__filename),
		},
		fixable: 'code',
		hasSuggestions: true,
		schema: [],
	},
};
