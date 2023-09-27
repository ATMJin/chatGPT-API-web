import {
  set, get,
  setMany, getMany,
  update,
  del, delMany,
  clear,
  entries, keys, values,
} from 'idb-keyval';

set('hello', 'world')
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));

// logs: "world"
get('hello')
  .then((val) => console.log(val));

setMany([
  [123, 456],
  ['hello', 'world'],
])
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));

getMany([123, 'hello'])
  .then(([firstVal, secondVal]) =>
    console.log(firstVal, secondVal),
  );

update('counter', (val) => (val || 0) + 1);

del('hello');

delMany([123, 'hello'])
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));

clear();

// logs: [[123, 456], ['hello', 'world']]
entries().then((entries) => console.log(entries));

// logs: [123, 'hello']
keys().then((keys) => console.log(keys));

// logs: [456, 'world']
values().then((values) => console.log(values));