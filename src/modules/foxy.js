`use strict`;

const fetch = require(`node-fetch`);

module.exports = async () => {
    const response = await fetch(`https://randomfox.ca/floof/`, { redirect: `follow` });
    const img = await response.json();
    return { files: [img.image] };
};