const Router = require('koa-router')
const logger = require('../logger')
const router = new Router();
const uri = "/jobs";

router.post(`${uri}/`, async (ctx) => {
  let json = JSON.parse(ctx.request.rawBody);
  let job = ctx.Job.create(json);
  if(job == null) {
    ctx.throw(400, 'INVALID PAYLOAD');
  }
  job.save()
    .then(ret => logger.debug(`Job ${job.id} saved ... OK`));
  job.attach(ctx.timers);
  ctx.body = job.json();
});

router.get(`${uri}/`, async (ctx) => {
  let map = await ctx.Job.index();
  let rows = []
  for(let id in map) {
    rows[rows.length] = JSON.parse(map[id])
  }
  ctx.body = rows;
});

router.del(`${uri}/:id`, async (ctx) => {
  ctx.Job.remove(ctx.params.id, ctx.timers);
  ctx.body = {
    error: 0,
    message: 'success'
  }
});

module.exports = router;