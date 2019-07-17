module.exports = (content) => {
    try {
        return JSON.stringify(JSON.parse(content));
    } catch (e) {
        console.error('Content is not JSON:', e);
    }
    return content;
};
