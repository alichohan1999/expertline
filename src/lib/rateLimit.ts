// Native in-memory sliding window limiter (per-process; resets on restart)
type Bucket = { timestamps: number[] };
const buckets: Map<string, Bucket> = new Map();

export async function checkRateLimit(
	ip: string,
	bucket: string,
	tokens = 10,
	windowSeconds = 60
) {
	const key = `${bucket}:${ip}`;
	const now = Date.now();
	const windowMs = windowSeconds * 1000;
	const entry = buckets.get(key) ?? { timestamps: [] };
	// Drop old timestamps
	entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

	if (entry.timestamps.length >= tokens) {
		buckets.set(key, entry);
		return { success: false, remaining: 0, reset: entry.timestamps[0] + windowMs - now } as const;
	}

	entry.timestamps.push(now);
	buckets.set(key, entry);
	return { success: true, remaining: tokens - entry.timestamps.length, reset: windowMs } as const;
}


