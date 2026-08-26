# Duders Zone

This is an archival website about video games. It shows video content from Giant
Bomb in a nostalgic and conveninent format, with the actual videos are hosted at
[Internet Archive](https://archive.org/details/giant-bomb-archive).

Thanks for everything! See you next game.

## Requirements

- Node 19+

## Developing

Install the dependencies:

```shell
npm install
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

## Syncing Data

The web app relies on bundled JSON files for its data store which need to be
refreshed using the Giant Bomb and Internet Archive APIs to get any updates to
the collection. This is done using the script in the _scripts_ directory.

This is done in two steps:

- Download the data from GB and IA into temporary files.
- Import the data from the temporary files to their respective JSON files.

It's done in two steps mainly to facilitate the development of the import step,
or to use a local backup when the GB API is down. The downloaded files are stored
in the `tmp/` directory and can be deleted once the import is complete.

To download data from Giant Bomb you will need an existing API key. This can
be retrieved from [Giant Bomb](https://www.giantbomb.com/api/) and you need to
provide it as an environment variable named `GB_API_KEY`.

```shell
set GB_API_KEY='your api key here'
```

Then the data can be downloaded using the `download` script:

```shell
npm run download
```

By default the script will skip files that exist, but if you want to force it to redownload then
just run `download:overwrite`:

```shell
npm run download:overwrite
```

Once this is complete (or you are working with existing cahced data), the data
can be imported into the site's datastore using the `import` script:

```shell
npm run import
```

Note that the `import` script is the one that will attempt to download images
for the GB shows.

Both commands can be run together in sequence by invoking the `sync` script:

```shell
npm run sync
```
