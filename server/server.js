const serve = require('koa-static');
const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');

const app = new Koa();
const router = new Router();

const LAYOUT_FILE = './public/layout.html';

const routes = {
  index: '/',
  project: '/project/:id',
  tag: '/tag/:tag',
  resume: '/resume',
  about: '/about',
};

Object.keys(routes).forEach((key) => {
  const route = routes[key];
  router.get(route, async (ctx, next) => {
    ctx.type = 'html';
    ctx.body = await fs.createReadStream(LAYOUT_FILE);
  });
});

app.use(router.routes());

app.use(serve('public'));

app.listen(3000);

console.log('Server running on port 3000');
