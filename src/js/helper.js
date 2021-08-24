import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

// Async func always returns Promise (resolved or Rejected)
async function AJAX(url, dataUpload = undefined) {
	try {
		const FETCH = dataUpload
			? fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dataUpload),
			  })
			: fetch(url);

		const res = await Promise.race([FETCH, timeout(TIMEOUT_SEC)]);
		const data = await res.json();

		if (!res.ok) throw new Error(`Error (${res.status}): ${data.message}`);
		// Returns Resolved value (Promise)
		return data;
	} catch (err) {
		throw err;
	}
}

export { AJAX };
/* If we handled error here. The fullfilled promise will be return even error accured 

If we throw error from Async function: It'll mean Promise gets rejected instead of resolved */
