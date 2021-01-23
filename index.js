const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const indexRoutes = require('./routes/index');
const jobRoutes = require('./routes/job');

const app = new Koa();
const PORT = process.env.PORT || 1337;

const Job = require('./job')();
app.context.Job = Job;
app.context.timers = {};

// Register presisted jobs...
Job.initial(app);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      error: ctx.status,
      message: err.message
    };
  }
});
app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript', 'application/json']
  },
  formLimit: '8mb',
  jsonLimit: '8mb'
}));

app.use(indexRoutes.routes());
app.use(jobRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
module.exports = server;