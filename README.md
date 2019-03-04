# Portland <img src="https://i.imgur.com/yhSOd6X.png" align="right">
> MangaDex -> Discord webhook

When running `Portland` the output will look like this:

![](https://i.imgur.com/3t3s259.png)

The output generated will be a lot more controllable.

For this to properly work it reads the RSS feed provided, then processes the data and `Portland` then forwards it to Discord via a webhook.  

## Setup

Prerequisites:
- Node.js
- MangaDex RSS feed
- Discord Webhook
- [Cloudinary](https://cloudinary.com/) account
- - Cloudinary is used to reupload the volume covers to our own image host for caching

First you need to make sure `Portland` is running, how that is done is up to the user itself, whether it be tmux, screen, pm2 or Docker.  
The configuration for the env, rss feed, port, Discord webhook and cloudinary is handled via environment variables, namely: `NODE_ENV=`, `PORT=`, `MANGADEX_RSS=`, `CLOUDINARY_URL=`, `DISCORD_WEBHOOK=`

(`CLOUDINARY_URL` consists of `cloudinary://api_key:secret@username`)

For a tutorial on how to setup a Discord webhook you can go here: <https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks>

After all of this is done you are good to go and have updates to your recently released manga chapters in Discord!

## Author

**Portland** © [iCrawl](https://github.com/iCrawl).  
Authored and maintained by iCrawl.

> GitHub [@iCrawl](https://github.com/iCrawl)
