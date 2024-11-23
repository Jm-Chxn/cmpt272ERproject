const PASSWORD_HASH = "76487c30fc324c2e9b3ed92caeb5126a"; // password: cmpt272

async function getMD5Hash(data: string): Promise<string> {
	const response = await fetch("https://api.hashify.net/hash/md5/hex", {
		method: "POST",
		headers: {
			"Content-Type": "text/plain",
		},
		body: data,
	});

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	const result = await response.json();
	return result.Digest;
}

export async function checkPassword(
	userPassword: string | null,
): Promise<boolean> {
	if (!userPassword) {
		return false;
	}

	try {
		const hash = await getMD5Hash(userPassword);
		if (hash === PASSWORD_HASH) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		alert(error);
		return false;
	}
}
