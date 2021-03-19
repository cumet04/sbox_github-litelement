const {resolve} = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const env = process.argv[2] === 'dev' ? 'dev' : 'production';
const srcPath = './src';
const distPath = require('./tsconfig.json').compilerOptions.outDir;
const publicPath = './static';
const webPort = 5000;
const apiPort = 4567;

const buildOpts = {
  entryPoints: [resolve(srcPath, 'index.ts')],
  outfile: resolve(distPath, 'bundle.js'),
  bundle: true,
  platform: 'browser',
  minify: env === 'production',
  sourcemap: env === 'dev' ? 'inline' : false,
  incremental: env === 'dev',
  define: {
    'process.env.NODE_ENV': `"${env}"`,
  },
  loader: {
    '.png': 'file',
  },
};

async function entry() {
  const builder = await esbuild.build(buildOpts);
  fs.readdirSync(resolve(publicPath)).forEach(path => {
    fs.copyFileSync(resolve(publicPath, path), resolve(distPath, path));
  });
  if (env !== 'dev') return;

  const chokidar = require('chokidar');
  const {hrtime, stdout, stderr} = process;

  chokidar.watch(resolve(srcPath)).on('change', () => {
    stdout.write('building...');
    const start = hrtime();
    builder
      .rebuild()
      .then(() => {
        const ms = (hrtime(start)[1] / 1e6).toFixed(1);
        stdout.write(`done, elapsed ${ms} ms\n`);
      })
      .catch(e => stderr.write(`[ERROR]: ${e}\n`));
  });

  dev({
    targetDir: resolve(distPath),
    webPort,
    apiPort,
  });
}

function dev({targetDir, webPort, apiPort}) {
  const express = require('express');
  const livereload = require('livereload');
  const cLivereload = require('connect-livereload');
  const proxy = require('http-proxy-middleware');

  const app = express();
  app.use(cLivereload());
  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: `http://localhost:${apiPort}`,
    })
  );
  app.use(express.static(targetDir));
  app.get('*', (_, res) => res.sendFile(resolve(targetDir, 'index.html')));
  app.listen(webPort);

  livereload.createServer().watch(targetDir);
}

entry();
