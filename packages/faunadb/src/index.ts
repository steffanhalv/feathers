import { BadRequest, errors, NotFound } from '@feathersjs/errors';
import { _ } from '@feathersjs/commons';
import { sorter, select, AdapterService, ServiceOptions, InternalServiceMethods, AdapterParams } from '@feathersjs/adapter-commons';
import sift from 'sift';
import { NullableId, Id } from '@feathersjs/feathers';
import faunadb from 'faunadb'

const {
  CreateCollection, Collection,
  Create, Get, Ref, Delete,
  Paginate, Lambda, Map, Documents,
  Let, Var, Select, Filter, And, Equals,
  Indexes, Match, Index
  // Sum, Add, Update
} = faunadb.query

export interface FaunaServiceOptions extends ServiceOptions {
  Model: any;
  collection: string
  matcher?: (query: any) => any
  sorter?: (sort: any) => any
}

const _select = (data: any, params: any, ...args: any[]) => {
  const base = select(params, ...args);

  return base(JSON.parse(JSON.stringify(data)));
};

let collectionPromise: Promise<any>

export async function setupCollection (client: any, collectionName: string) {
  if (!collectionPromise) collectionPromise =
    client.query(CreateCollection({ name: collectionName }))
      .then((result: any) => {
        return result.ref
      })
      .catch((error: any) => {
        if (error.message === 'instance already exists') {
          return client.query(Collection(collectionName))
        }
        throw error
      })

  const collection = await collectionPromise
  return collection
}

export async function getIndexesForCollection (client: any, collectionName: string) {
  const results = await client.query(
    Map(
      Paginate(Indexes(), { size: 100_000 }),
      Lambda('record', Get(Var('record')))
    )
  )
  const indexes = results.data.filter((i: any) => i.source?.value?.id === collectionName)
  return indexes
}

export class Service<T = any, D = Partial<T>> extends AdapterService<T, D> implements InternalServiceMethods<T> {
  options: FaunaServiceOptions
  indexes: any[] = []
  Model: any

  constructor (options: Partial<FaunaServiceOptions> = {}) {
    super(_.extend({
      id: 'id',
      matcher: sift,
      sorter
    }, options));
    this.Model = options.Model || {};

    if (!options.collection) {
      throw new Error('\'collection name is required')
    }
    setupCollection(options.Model, options.collection)
  }

  formatResult (result: any) {
    const { ref, data } = result
    const record = {
      [this.options.id]: ref.value.id,
      ...data
    }
    return record
  }

  async getEntries (params = {}) {
    const { query } = this.filterQuery(params);

    return this._find(Object.assign({}, params, {
      paginate: false,
      query
    }) as any) as Promise<T[]>;
  }


  getCollection (params: AdapterParams = {}) {
    return params.collection || this.options.collection
  }

  async getIndexes (collectionName: string) {
    if (!this.indexes.length) {
      this.indexes = await getIndexesForCollection(this.Model, collectionName)
    }
    return this.indexes
  }

  async refreshIndexes (collectionName?: string) {
    this.indexes = await getIndexesForCollection(this.Model, collectionName || this.options.collection)
    return this.indexes
  }

  // @ts-ignore
  getBestIndexForQuery (query: any, filters: any) {
    const indexes = this.indexes
    let match: any
    if (filters.$sort) {
      const sortKey = Object.keys(filters.$sort)[0]
      const reverse = filters.$sort[sortKey] === -1 ? true : undefined
      // Make sure the index keys match the query keys in the index values
      const allValuesMatch = (i: any) => {
        return !!i.values?.find((v: any) => {
          return v.field.join('.') === `data.${sortKey}` && v.reverse === reverse
        })
      }
      const allTermsMatch = (i: any) => {
        return !!i.terms?.find((v: any) => {
          return v.field.join('.') === `data.${sortKey}`
        })
      }
      match = indexes.find((i: any) => {
        const valuesMatch = allValuesMatch(i)
        const termsMatch = allTermsMatch(i)
        return valuesMatch && termsMatch
      })
    }
    return match
  }

  // @ts-ignore
  getTermsFromIndex (query: any, index: any) {
    const keys = index.terms.map((t: any) => t.field[1] ).filter((f: any) => f)
    return keys.map((key: string) => query[key])
  }

  async _find (params: AdapterParams = {}) {
    const name = this.getCollection(params)
    const collection = await setupCollection(this.Model, name)
    await this.getIndexes(name)
    const { query, filters, paginate } = this.filterQuery(params);
    // @ts-ignore
    const requiresIndex = Object.keys(query).length || filters.$sort
    const bestIndex = params.query.$index || this.getBestIndexForQuery(query, filters)
    const terms = bestIndex ? this.getTermsFromIndex(query, bestIndex) : []

    if (requiresIndex && !bestIndex) {
      throw new errors.BadRequest(`No matching index for query ${JSON.stringify(params.query)}. Please explicitly provide an '$index' in the query.`)
    }
    let fQuery = Documents(collection)

    const size = paginate.default || 100_000

    if (bestIndex) {
      // @ts-ignore
      const refIndex = bestIndex.values.findIndex((v: any) => v.field[0] === 'ref')
      const indexResponse = await this.Model.query(
        // Map(
          Paginate(
            Match(Index(bestIndex.name), terms[0]),
            { size }
          ),
          // Lambda('index_result', Get(Select(Var('index_result'), refIndex)))
        // )
      )
      console.log(indexResponse)
      fQuery = {}
    } else {
      fQuery = Map(
        Paginate(fQuery, { size }),
        Lambda('record', Get(Var('record')))
      )
    }

    // if (filters.$sort !== undefined) {
    //   values.sort(this.options.sorter(filters.$sort));
    // }

    // if (filters.$skip !== undefined) {
    //   values = values.slice(filters.$skip);
    // }

    // if (filters.$limit !== undefined) {
    //   values = values.slice(0, filters.$limit);
    // }

    const response = await this.Model.query(fQuery)

    const data = response.data.map((r: any) => this.formatResult(r))

    const result = {
      total: 0,
      limit: filters.$limit,
      skip: filters.$skip || 0,
      data
    };

    if (!(paginate && (paginate).default)) {
      return result.data;
    }

    return result;
  }


  // Applies query.$select to the FQL query
  applySelect (fQuery: any, filters: any = {}) {
    const $select = filters.$select || []

    if ($select.length) {
      const fqSelect = $select.reduce((obj: any, key: string) => {
        obj.data[key] = Select(['data', key], Var('record'))
        return obj
      }, {
        ref: Select(['ref'], Var('record')),
        data: {}
      })
      return Let({ record: fQuery }, fqSelect)
    }

    return fQuery
  }

  /**
   * Runs the query through the Filter function by passing the item (or each item) through
   * a Lambda function that compares each value using the "And" boolean operation.
   * @param fQuery
   * @param query
   * @returns
   */
  applyQuery (fQuery: any, query: any, method = 'get') {
    const hasQuery = !!Object.keys(query).length

    if (hasQuery) {
      // Setup conditions for the And expression
      const conditions = Object.entries(query).map(([key, value]) => {
        return Equals(
          Select(['data', ...key.split('.')], Var('record')), value
        )
      })
      const filteredQuery = Filter([fQuery], Lambda('record', And(...conditions)))
      // Use the first returned record for 'get' requests (since Filter returns an array)
      const fqQuery = method === 'get'
        ? Select(0, filteredQuery)
        : filteredQuery
      return fqQuery
    }


    return fQuery
  }

  async _get (id: Id, params: AdapterParams = {}) {
    const collection = await setupCollection(this.Model, this.getCollection(params))
    // @ts-ignore
    const { query, filters, paginate } = this.filterQuery(params);

    let fQuery = Get(Ref(collection, id))
    fQuery = this.applyQuery(fQuery, query)
    fQuery = this.applySelect(fQuery, filters)

    try {
      const result = await this.Model.query(fQuery)
      return this.formatResult(result)
    } catch (error: any) {
      // No value was found after applying Filter
      if (error.message === 'value not found') {
        throw new NotFound()
      }
      // Bad id
      if (error.description.includes(id)) {
        throw new NotFound()
      }
      debugger
      throw new BadRequest(error)
    }

    throw new NotFound(`No record found for id '${id}'`);
  }

  // Create without hooks and mixins that can be used internally
  async _create (data: Partial<T> | Partial<T>[], params: AdapterParams = {}): Promise<T | T[]> {
    const collection = await setupCollection(this.Model, this.getCollection(params))
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this._create(current, params) as Promise<T>));
    }
    const { filters } = this.filterQuery(params);

    let fQuery = Create(collection, { data })
    fQuery = this.applySelect(fQuery, filters)

    try {
      const result = await this.Model.query(fQuery)
      return this.formatResult(result)
    } catch (error: any) {
      debugger
      throw new BadRequest(error)
    }

  }

  async _update (id: NullableId, data: T, params: AdapterParams = {}) {
    const collection = await setupCollection(this.Model, this.getCollection(params))
    console.log(collection)
    const oldEntry = await this._get(id);
    // We don't want our id to change type if it can be coerced
    const oldId = oldEntry[this.id];

    // eslint-disable-next-line eqeqeq
    id = oldId == id ? oldId : id;

    this.Model[id] = _.extend({}, data, { [this.id]: id });

    return this._get(id, params);
  }

  async _patch (id: NullableId, data: Partial<T>, params: AdapterParams = {}) {
    const collection = await setupCollection(this.Model, this.getCollection(params))
    console.log(collection)
    const patchEntry = (entry: T) => {
      const currentId = (entry as any)[this.id];

      this.Model[currentId] = _.extend(this.Model[currentId], _.omit(data, this.id));

      return _select(this.Model[currentId], params, this.id);
    };

    if (id === null) {
      const entries = await this.getEntries(params);

      return entries.map(patchEntry);
    }

    return patchEntry(await this._get(id, params)); // Will throw an error if not found
  }

  // Remove without hooks and mixins that can be used internally
  async _remove (id: NullableId, params: AdapterParams = {}): Promise<T | T[]> {
    const collectionName = this.getCollection(params)
    const collection = await setupCollection(this.Model, collectionName)
    if (id === null) {
      const result = await this.Model.query(
        Map(
          Paginate(
            Documents(collection),
            { size: 9999 }
          ),
          Lambda(
            ['ref'],
            Delete(Var('ref'))
          )
        )
      )
      return result
    }
    if (!id) {
      throw new BadRequest('id is required')
    }

    try {
      const result = await this.Model.query(
        Delete(Ref(Collection(collectionName), id))
      )
      return this.formatResult(result)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export function fauna (options: Partial<FaunaServiceOptions> = {}) {
  return new Service(options);
}
