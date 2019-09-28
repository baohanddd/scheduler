const uuid = require('uuid/v1');
const Joi = require('@hapi/joi');
const l = require('./logger');
const Io = require('./io');
const request = require('request');

const schema = Joi.object().keys({
  url: Joi.string().required(),
  method: Joi.string().required(),
  at: Joi.date().timestamp('unix').required(),
  id: Joi.any(),
  headers: Joi.any(),
  params: Joi.any(),
  type: Joi.any()
});

const getPrimaryKey = () => {
  return uuid();
};

let now = () => {
  return parseInt((new Date()).getTime() / 1000);
};

const JobFactory = (redis) => {

  const io = Io(redis);

  const create = (json) => {
    let ret = schema.validate(json);
    if(ret.error) {
      l.error(ret.error);
      l.error('INVALID PAYLOAD', json);
      return null;
    }

    let delay = json.at - now();
    let interval = 0;
    if(delay < 0) {
      l.error(`the delay ${delay} has to greater than zero`);
      return null;
    } else {
      interval = delay * 1000;
      // interval = 2000;
    }

    if("id" in json === false) {
      json.id = getPrimaryKey();
    }

    if("headers" in json === false) {
      json.headers = {};
    }

    if("params" in json === false) {
      json.params = {};
    }

    if("type" in json === false) {
      json.type = 'form';
    }
  
    return {
      id: json.id,
      save: () => io.save(json),
      json: () => json,
      remove: () => io.remove(json.id),
      attach: (timers) => {
        let timer = setTimeout(() => {
          let opts = {
            method: json.method,
            uri: json.url,
            headers: json.headers,
            form: json.params
          };

          if(json.type == 'form') {
            opts.form = json.params
          }

          if(json.type == 'json') {
            opts.json = json.params
          }

          request(opts, function(err, res, body) {
            if(err) {
              l.error(`An error occurs when call ${json.url} with params ${json.params}`)
              l.error(err);
              l.error(body);
              return ;
            }
            l.info(`${json.url} called ... success`, {
              status: res.statusCode,
              body: body.toString()
            });
          });
          l.info(`job ${json.id} is triggered ... success`)
          remove(json.id, timers)
        }, interval);
        timers[json.id] = timer;
        l.debug(`Assign a job ${json.id} after ${delay} seconds ... success`)
      }
    };
  };

  const initial = (app) => {
    io.all()
      .then(map => {
        for(let id in map) {
          let job = create(JSON.parse(map[id]));
          if(job) {
            job.attach(app.context.timers);
          }
        }
      });
  };

  const index = () => {
    return io.all();
  };

  const remove = (id, timers) => {
    if(id in timers) {
      let timer = timers[id]
      clearTimeout(timer);
      delete timers[id]
    }
    io.remove(id);
    l.info(`Removed job ${id} ... success`)
  }

  return {create, initial, remove, index};
}

module.exports = JobFactory;