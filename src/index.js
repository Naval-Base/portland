require('dotenv').config();
const fetch = require('@spectacles/rest')('', { tokenType: '' });
const cloudscraper = require('cloudscraper');
const logger = require('./logger');
const Keyv = require('keyv');
const Parser = require('rss-parser');
const cloudinary = require('cloudinary');
const parser = new Parser();
const cache = new Keyv('sqlite://cache.db', { namespace: 'cache' });

let LAST_CHECKED;

(async function checkRSS() {
	let res;
	let feed;
	try {
		feed = await parser.parseURL(process.env.MANGADEX_RSS);
	} catch (error) {
		logger.error(error);
		try {
			res = await cloudscraper(process.env.MANGADEX_RSS);
			feed = await parser.parseString(res);
		} catch (err) {
			logger.error(err);
			return setTimeout(checkRSS, 600000);
		}
	}
	LAST_CHECKED = await cache.get('last_checked') || feed.items[0].isoDate;
	logger.info(`Running RSS for: ${LAST_CHECKED}`);
	const filtered = await Promise.all(feed.items.filter(item => new Date(LAST_CHECKED) < new Date(item.isoDate)).map(async item => {
		let chapterData;
		try {
			chapterData = await fetch.get(`https://mangadex.org/api/chapter/${item.link.match(/\d+/)[0]}`);
		} catch (error) {
			logger.error(error);
			try {
				chapterData = await cloudscraper(`https://mangadex.org/api/chapter/${item.link.match(/\d+/)[0]}`);
			} catch (err) {
				return;
			}
		}

		const hit = await cache.get(chapterData.manga_id);
		let image;
		if (hit) {
			image = hit.cover;
		} else {
			let mangaData;
			try {
				try {
					mangaData = await fetch.get(`https://mangadex.org/api/manga/${chapterData.manga_id}`);
				} catch (err) {
					mangaData = await cloudscraper(`https://mangadex.org/api/manga/${chapterData.manga_id}`);
				}
				image = (await cloudinary.v2.uploader.upload(`https://mangadex.org${mangaData.manga.cover_url}`)).secure_url;
			} catch (error) {
				logger.error(error);
				return;
			}

			await cache.set(chapterData.manga_id, {
				title: mangaData.title,
				mangaId: chapterData.manga_id,
				cover: image
			});
		}

		return {
			title: item.title,
			link: item.link,
			content: item.content,
			isoDate: item.isoDate,
			cover: image
		};
	}));

	if (process.env.NODE_ENV !== 'test') {
		for (const manga of filtered) {
			try {
				await fetch.post(process.env.DISCORD_WEBHOOK, {
					embeds: [{
						title: manga.title,
						color: 3394611,
						description: `${manga.content}\n\nRead here: [MangaDex](${manga.link})`,
						thumbnail: { url: manga.cover }
					}]
				});
			} catch (error) {
				logger.error(error);
			}

			logger.info(`Sent notification for: ${manga.title}`);
		}
	}

	if (filtered.length) {
		await cache.set('last_checked', filtered[0].isoDate);
		LAST_CHECKED = filtered[0].isoDate;
	} else {
		await cache.set('last_checked', new Date().toISOString());
		LAST_CHECKED = new Date().toISOString();
	}
	logger.info(`Set new last checked to: ${LAST_CHECKED}`);

	return setTimeout(checkRSS, 1200000);
})();
