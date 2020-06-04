`use strict`;

const { funcs } = require(`../index`);

module.exports = async () => `?` + funcs.join(`\n?`);