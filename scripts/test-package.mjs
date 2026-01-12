import { pathToFileURL } from 'url';
import path from 'path';

const libPath = path.resolve('./dist/index.mjs');
const libUrl = pathToFileURL(libPath).href;

(async () => {
	try {
		const pkg = await import(libUrl);
		console.log('Exports from dist/index.mjs:');
		console.log(Object.keys(pkg).sort().join('\n'));
	} catch (err) {
		console.error('Failed to import package:', err);
		process.exit(2);
	}
})();
