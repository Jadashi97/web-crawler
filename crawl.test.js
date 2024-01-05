const { test, expect } =  require('@jest/globals');
const { normalizeURL, getURLsFromHTML} =  require('./crawl.js');

test('normalizeURL protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

