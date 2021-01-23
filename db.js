const level = require('level')
const db = level('db')

module.exports = (key) => {

  const all  = (callback) => {
    var option = { start: key, keys: false};
    var map = [];
    db.createReadStream(option)
      .on('data', data => map[map.length] = data)
      .on('end', () => callback(null, map))
      .on('error', err => callback(err, null))
  }
  const save = (id, data, callback) => {
    db.put(pk(id), data, err => callback(err))
  }
  const del  = (id, callback) => {
    db.del(pk(id), err => callback(err))
  }
  const get  = (id, callback) => {
    db.get(pk(id), (err, data) => callback(err, data))
  }
  const pk   = id => { return key + id }

  return {all, save, del, get}
}