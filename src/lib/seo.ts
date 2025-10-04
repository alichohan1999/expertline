import { getBaseUrl } from "./env";

export function buildTitle(parts: (string | undefined)[], site = "Expertline") {
	const filtered = parts.filter(Boolean) as string[];
	return [...filtered, site].join(" · ");
}

export function truncate(text: string, max = 160) {
	if (text.length <= max) return text;
	return text.slice(0, max - 1) + "…";
}

/**
 * Generate absolute URL for a given path
 * @param path - The path to generate URL for
 * @returns Absolute URL
 */
export function getAbsoluteUrl(path: string): string {
	const baseUrl = getBaseUrl();
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${baseUrl}${cleanPath}`;
}

/**
 * Generate Open Graph meta tags with absolute URLs
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path
 * @param image - Optional image path
 * @returns Meta tags object
 */
export function generateMetaTags(
	title: string,
	description: string,
	path: string,
	image?: string
) {
	const url = getAbsoluteUrl(path);
	const imageUrl = image ? getAbsoluteUrl(image) : getAbsoluteUrl('/logos/expertline-logo-s-t-d.svg');
	
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [imageUrl],
		},
	};
}


