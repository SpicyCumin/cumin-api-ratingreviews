


const cachedLogs = true // true will turn on all logs to the cache


let fetchedFromCache = 1;


const cleanup = (key, timeToCleanup, store) => {
  setTimeout(() => {
    // cachedLogs && console.log('deleted from cache ', key, timeToCleanup)
    console.log('deleted from cache ', key, timeToCleanup)
    delete store[key]
  }, timeToCleanup)

}

const getKey = (productId) => {
  return `meta_${productId}`
}

const baseTime = 8 * 1000

const baseOptions = {
  maxStoreTime: baseTime,
  promises: true,
  getKey
}

const ShortCache = (options = {}) => {
  const cache = { ...baseOptions,  ...options };
  cache.store = {}



  cache.add = (productId, value) => {
    const key = cache.getKey(productId)
    // const createdAt = Date.now()

    cache.store[key] = value
    console.log('added to cache ', key)
    console.log('cache ', cache.store)
    // if(!(fetchedFromCache % 250)) {
    //   console.log(`${fetchedFromCache} metas fetched from the cache`)
    // }
    // cachedLogs && console.log('added to cache ', key)
    cleanup(key, cache.maxStoreTime, cache.store)
  }


  cache.get = (key, promise = cache.promises) => {
    // cachedLogs && console.log('fetched from cache ', key)
    if (promise) {
      fetchedFromCache++
      return new Promise((res, rej) => res(cache.store[key] ))
    }
    return cache.store[key]
  }

  cache.check = (productId, toReturn = true, promise = cache.promises) => {
    const key = cache.getKey(productId)
    console.log('checking for key ', key)
    var found = !!cache.store[key]
    console.log('found ', cache.store[key])
    if (found && toReturn) {
      return cache.get(key, promise)
    }
    return found;
  }

  cache.remove = (productId) => {
    const key = cache.getKey(productId)
    delete cache.store[key]
    // cachedLogs && console.log('removed from cache ', key)
    // console.log(cache.store)
  }

  return cache;
}

module.exports = { ShortCache }