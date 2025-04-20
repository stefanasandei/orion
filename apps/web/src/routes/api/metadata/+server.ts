import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

// get link metadata, used to show previews
export async function GET({ url }) {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
        throw error(400, 'URL parameter is required');
    }

    try {
        const response = await fetch(targetUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Get metadata from meta tags, Open Graph, Twitter Cards, and fallback to regular HTML tags
        const metadata = {
            title: $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text() ||
                targetUrl,

            description: $('meta[property="og:description"]').attr('content') ||
                $('meta[name="twitter:description"]').attr('content') ||
                $('meta[name="description"]').attr('content') ||
                '',

            image: $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content') ||
                $('meta[name="image"]').attr('content') ||
                // Fallback to first large image if no meta image
                $('img[width][height]').filter((_, img) => {
                    const width = parseInt($(img).attr('width') || '0');
                    const height = parseInt($(img).attr('height') || '0');
                    return width >= 200 && height >= 200;
                }).first().attr('src') ||
                '',

            // Additional metadata that might be useful
            site: $('meta[property="og:site_name"]').attr('content') ||
                $('meta[name="application-name"]').attr('content'),

            author: $('meta[name="author"]').attr('content'),

            type: $('meta[property="og:type"]').attr('content') ||
                $('meta[name="twitter:card"]').attr('content')
        };

        // Clean up the image URL if it's relative
        if (metadata.image && !metadata.image.startsWith('http')) {
            try {
                const baseUrl = new URL(targetUrl);
                metadata.image = metadata.image.startsWith('/')
                    ? `${baseUrl.protocol}//${baseUrl.host}${metadata.image}`
                    : `${baseUrl.protocol}//${baseUrl.host}${baseUrl.pathname}${metadata.image}`;
            } catch (e) {
                console.error('Error parsing image URL:', e);
                metadata.image = '';
            }
        }

        return json(metadata);
    } catch (err) {
        console.error('Error fetching metadata:', err);
        throw error(500, 'Failed to fetch metadata');
    }
}