`use strict`;

const fetch = require(`node-fetch`);

module.exports = async () => {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search`, { redirect: `follow` });
    const [img] = await response.json();
    return {files:[img.url]};
};