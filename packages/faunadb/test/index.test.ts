/* eslint-disable no-console */
import assert from 'assert';
import adapterTests from '@feathersjs/adapter-tests';
import errors from '@feathersjs/errors';
import { feathers } from '@feathersjs/feathers';
import faunadb from 'faunadb'

import { fauna, setupCollection } from '../src';

const { CreateIndex, Index, Delete, Do } = faunadb
const faunaClient = new faunadb.Client({
  secret: 'fnAEXcaR4lACQvsy2TqpUVgRbtl2hQISPTemUVkL',
});

const testSuite = adapterTests([
  // '.options',
        // '.events',
        // '._get',
  // '._find',
  // '._create',
  // '._update',
  // '._patch',
  // '._remove',
  // '.get',
  // '.get + $select',
  // '.get + id + query',
  // '.get + NotFound',
  // '.get + id + query id',
  // '.find',
  '.find + paginate + query',
        // '.remove',
        // '.remove + $select',
        // '.remove + id + query',
        // '.remove + multi',
        // '.remove + id + query id',
        // '.update',
        // '.update + $select',
        // '.update + id + query',
        // '.update + NotFound',
        // '.update + id + query id',
        // '.update + query + NotFound',
        // '.patch',
        // '.patch + $select',
        // '.patch + id + query',
        // '.patch multiple',
        // '.patch multi query same',
        // '.patch multi query changed',
        // '.patch + query + NotFound',
        // '.patch + NotFound',
        // '.patch + id + query id',
  // '.create',
  // '.create + $select',
  // '.create multi',
        // 'internal .find',
        // 'internal .get',
        // 'internal .create',
        // 'internal .update',
        // 'internal .patch',
        // 'internal .remove',
        // '.find + equal',
        // '.find + equal multiple',
        // '.find + $sort',
        // '.find + $sort + string',
        // '.find + $limit',
        // '.find + $limit 0',
        // '.find + $skip',
        // '.find + $select',
        // '.find + $or',
        // '.find + $in',
        // '.find + $nin',
        // '.find + $lt',
        // '.find + $lte',
        // '.find + $gt',
        // '.find + $gte',
        // '.find + $ne',
        // '.find + $gt + $lt + $sort',
        // '.find + $or nested + $sort',
        // '.find + paginate',
        // '.find + paginate + $limit + $skip',
        // '.find + paginate + $limit 0',
        // '.find + paginate + params',
        // 'params.adapter + paginate',
        // 'params.adapter + multi'
]);

describe('Feathers Memory Service', () => {
  const name = 'people'
  let collection: any
  let index: any
  let indexReverse: any

  const events = [ 'testing' ];
  const app = feathers()
    .use('/people', fauna({
      Model: faunaClient,
      collection: name,
      events
    }))
    .use('/people-customid', fauna({
      Model: faunaClient,
      collection: name,
      id: 'customid', events
    }));

  before(async () => {
    collection = await setupCollection(faunaClient, name)
    const indexName = 'people_by_name'
    // Must create an index for sorting: https://docs.fauna.com/fauna/current/tutorials/indexes/sort
    try {
      index = await faunaClient.query(
        CreateIndex({
          name: indexName,
          source: collection,
          terms: [
            { field: ['data', 'name'] }
          ],
          values: [
            { field: ['data', 'name'] },
            { field: ['ref']}
          ]
        })
      )
    } catch (error) {
      console.log(`✅ index '${indexName}'' already exists`)
      index = await faunaClient.query(Index(indexName))
    }
    try {
      indexReverse = await faunaClient.query(
        CreateIndex({
          name: indexName + '_desc',
          source: collection,
          terms: [
            { field: ['data', 'name'] }
          ],
          values: [
            { field: ['data', 'name'], reverse: true },
            { field: ['ref']}
          ]
        })
      )
    } catch (error) {
      console.log(`✅ index '${indexName}_desc'' already exists`)
      index = await faunaClient.query(Index(indexName))
    }
  })

  after(async () => {
    await faunaClient.query(
      Do(
        Delete(index),
        Delete(indexReverse)
      )
    )
  })

  it.skip('update with string id works', async () => {
    const people = app.service('people');
    const person = await people.create({
      name: 'Tester',
      age: 33
    });

    const updatedPerson: any = await people.update(person.id.toString(), person);

    assert.strictEqual(typeof updatedPerson.id, 'number');

    await people.remove(person.id.toString());
  });

  it.skip('patch record with prop also in query', async () => {
    app.use('/animals', fauna({ multi: true }));
    const animals = app.service('animals');
    await animals.create([{
      type: 'cat',
      age: 30
    }, {
      type: 'dog',
      age: 10
    }]);

    const [updated] = await animals.patch(null, { age: 40 }, { query: { age: 30 } });

    assert.strictEqual(updated.age, 40);

    await animals.remove(null, {});
  });

  it.skip('allows to pass custom find and sort matcher', async () => {
    let sorterCalled = false;
    let matcherCalled = false;

    app.use('/matcher', fauna({
      matcher () {
        matcherCalled = true;
        return function () {
          return true;
        };
      },

      sorter () {
        sorterCalled = true;
        return function () {
          return 0;
        };
      }
    }));

    await app.service('matcher').find({
      query: { $sort: { something: 1 } }
    });

    assert.ok(sorterCalled, 'sorter called');
    assert.ok(matcherCalled, 'matcher called');
  });

  it.skip('does not modify the original data', async () => {
    const people = app.service('people');

    const person = await people.create({
      name: 'Delete tester',
      age: 33
    });

    delete person.age;

    const otherPerson = await people.get(person.id);

    assert.strictEqual(otherPerson.age, 33);

    await people.remove(person.id);
  });

  it.skip('does not $select the id', async () => {
    const people = app.service('people');
    const person = await people.create({
      name: 'Tester'
    });
    const results = await people.find({
      query: {
        name: 'Tester',
        $select: ['name']
      }
    });

    assert.deepStrictEqual(results[0], { name: 'Tester' },
      'deepEquals the same'
    );

    await people.remove(person.id);
  });

  it.skip('update with null throws error', async () => {
    try {
      await app.service('people').update(null, {});
      throw new Error('Should never get here');
    } catch (error: any) {
      assert.strictEqual(error.message, 'You can not replace multiple instances. Did you mean \'patch\'?');
    }
  });

  testSuite(app, errors, 'people');
  testSuite(app, errors, 'people-customid', 'customid');
});
