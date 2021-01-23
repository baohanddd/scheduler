const hash = "jobs";
const db = require('./db')(hash)

const Io = () => {

  const all = () => {
    return new Promise((resolve, reject) => {
      db.all((err, map) => {
        if(err) return reject(err);
        resolve(map) 
      });
    })
  };

  const save = (json) => {
    return new Promise((resolve, reject) => {
      db.save(json.id, JSON.stringify(json), err => {
        if (err) return reject(err);
        resolve();
      });
    })
  };

  const remove = (id) => {
    return new Promise((resolve, reject) => {
      db.del(id, err => {
        if (err) return reject(err)
        resolve()
      });
    })
  };

  const get = (id) => {
    return new Promise((resolve, reject) => {
      db.get(id, (err, job) => {
        if (err) return reject(err)
        resolve(JSON.parse(job))
      })
    })
  }
  return {all, save, remove, get}
};
module.exports = Io;