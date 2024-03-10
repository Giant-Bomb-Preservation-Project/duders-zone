# Duders Zone

This is an archival website about video games. It shows video content from Giant
Bomb where the actual videos are hosted at
[Internet Archive](https://archive.org/details/giant-bomb-archive). It's
maintained for my own nostalgic benefit.

Thanks for everything! See you next game.

## Requirements

-   Node 19+
-   Python 3.9+ (optional - for refreshing the data store)

## Developing

Install the dependencies:

```shell
npm run install
```

Run the development server:

```shell
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Use the `check` script to validate TypeScript code:

```shell
npm run check
```

Use the `format` script to format code:

```shell
npm run format
```

Use the `test` script to test the code:

```shell
npm run test
```

## Deploying

Use the `build` script to make a production build of the site:

```bash
npm run build
```

Note that the site is configured to be run on [Netlify](https://netlify.com/)
and may not run correctly on a different platform. If you want to run it
somewhere else you may need to change the adapter in the svelte.config.js file.

## Downloading Data

The web app relies on bundled JSON files for its data store which need to be
refreshed using the Giant Bomb and Internet Archive APIs to get any updates to
the collection. This is done using the script in the _scripts_ directory.

To run the script you will need an existing Giant Bomb API key. This can
be retrieved from [Giant Bomb](https://www.giantbomb.com/api/) (while it's still
available) and you need to provide it as an environment variable named
`GB_API_KEY`.

Once that's in place you can run the script using the `sync` command:

```shell
npm run sync
```

Or manually using Node:

```shell
node run scripts/sync_data.js
```
