const hash = "jobs";

const Io = (redis) => {

  const all = () => {
    return new Promise((resolve, reject) => {
      redis.hgetall(hash, (err, map) => { 
        if(err) return reject(err);
        resolve(map) 
      });
    })
  };

  const save = (json) => {
    return new Promise((resolve) => {
      redis.hset(hash, json.id, JSON.stringify(json), (ret) => {
        resolve(ret);
      });
    })
  };

  const remove = (id) => {
    return new Promise(resolve => {
      redis.hdel(hash, id, () => {
        resolve();
      })
    })
  };

  const get = (id) => {
    return new Promise(resolve => {
      redis.hget(hash, id, (job) => {
        resolve(JSON.parse(job));
      })
    })
  }

  return {
    all, save, remove, get
  }

};
module.exports = Io;