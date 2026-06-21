import assert from 'node:assert/strict';
import test from 'node:test';
const moduleUrl = new URL(
  `../scripts/submit-indexnow.mjs?test=${Date.now()}`,
  import.meta.url,
);

async function withMockFetch(response, callback) {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return response;
  };
  try {
    return await callback(requests);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('IndexNow submit sends the default landing URL list and protocol payload', async () => {
  const { submitIndexNow } = await import(moduleUrl.href);

  await withMockFetch(
    new Response('', { status: 200 }),
    async (requests) => {
      const result = await submitIndexNow(['node', 'submit-indexnow.mjs']);
      const key = result.payload.key;

      assert.equal(result.exitCode, 0);
      assert.equal(requests[0].url, 'https://api.indexnow.org/indexnow');
      assert.equal(
        requests[0].options.headers['Content-Type'],
        'application/json; charset=utf-8',
      );
      assert.deepEqual(JSON.parse(requests[0].options.body), {
        host: 'riadence.com',
        key,
        keyLocation: `https://riadence.com/${key}.txt`,
        urlList: [
          'https://riadence.com/',
          'https://riadence.com/sk/',
          'https://riadence.com/rs/',
          'https://riadence.com/ua/',
        ],
      });
    },
  );
});

test('IndexNow submit uses a comma-separated argv URL override', async () => {
  const { submitIndexNow } = await import(moduleUrl.href);

  await withMockFetch(
    new Response('', { status: 202 }),
    async () => {
      const result = await submitIndexNow([
        'node',
        'submit-indexnow.mjs',
        'https://riadence.com/sk/, https://riadence.com/ua/',
      ]);

      assert.deepEqual(result.payload.urlList, [
        'https://riadence.com/sk/',
        'https://riadence.com/ua/',
      ]);
      assert.equal(result.exitCode, 0);
    },
  );
});

test('IndexNow submit returns exit code 1 for validation failures', async () => {
  const { submitIndexNow } = await import(moduleUrl.href);

  for (const status of [400, 403, 422]) {
    await withMockFetch(
      new Response(`failure ${status}`, { status }),
      async () => {
        const result = await submitIndexNow(['node', 'submit-indexnow.mjs']);
        assert.equal(result.status, status);
        assert.equal(result.exitCode, 1);
        assert.equal(result.body, `failure ${status}`);
      },
    );
  }
});
