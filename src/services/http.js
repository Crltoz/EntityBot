/**
 * @description The single place the bot talks HTTP.
 *
 * Node has had a global `fetch` since 18, so nothing here needs the `https` module and its
 * chunk-collecting callbacks. Timeouts are the one thing `fetch` does not give us by default:
 * without a signal a hung connection would leave an interaction deferred forever.
 */

const REQUEST_TIMEOUT = 20000;

/**
 * @param {String} version - Bot version, appended to the configured agent.
 * @description User-Agent header, with a fallback so the scripts work without a .env.
 */
function userAgent(version) {
    return (process.env.USER_AGENT || "EntityBot") + (version || "");
}

/**
 * @param {String} url - Absolute URL.
 * @param {Object} options - method, headers and timeout (ms).
 * @description Perform a request and read the whole body as text. Rejects only on network
 *              errors and timeouts: the status is returned so callers can branch on it,
 *              which is what the Steam and tricky.lol endpoints need.
 */
async function request(url, options = {}) {
    const { method = "GET", headers = {}, timeout = REQUEST_TIMEOUT } = options;
    const response = await fetch(url, {
        method: method,
        headers: headers,
        signal: AbortSignal.timeout(timeout)
    });
    return {
        status: response.status,
        ok: response.ok,
        body: await response.text()
    };
}

/**
 * @param {String} url - Absolute URL.
 * @param {Object} options - Same as `request`.
 * @description GET a JSON endpoint, rejecting on any non-2xx or malformed body.
 */
async function getJson(url, options) {
    const response = await request(url, options);
    if (!response.ok) throw new Error(`${url} responded ${response.status}`);
    try {
        return JSON.parse(response.body);
    } catch (err) {
        throw new Error(`${url} returned invalid JSON: ${err.message}`);
    }
}

/**
 * @param {String} url - Absolute URL.
 * @param {Object} options - Same as `request`.
 * @description GET a text endpoint, rejecting on any non-2xx.
 */
async function getText(url, options) {
    const response = await request(url, options);
    if (!response.ok) throw new Error(`${url} responded ${response.status}`);
    return response.body;
}

/**
 * @param {String} url - Absolute URL.
 * @param {Object} options - Same as `request`.
 * @description GET a binary body (an icon), rejecting on any non-2xx. `fetch` follows
 *              redirects on its own, which the wiki's file URLs rely on.
 */
async function getBuffer(url, options = {}) {
    const { headers = {}, timeout = REQUEST_TIMEOUT } = options;
    const response = await fetch(url, { headers: headers, signal: AbortSignal.timeout(timeout) });
    if (!response.ok) throw new Error(`${url} responded ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
}

module.exports = {
    REQUEST_TIMEOUT: REQUEST_TIMEOUT,
    getBuffer: getBuffer,
    userAgent: userAgent,
    request: request,
    getJson: getJson,
    getText: getText
}
