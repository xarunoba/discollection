import { Deta } from 'deta'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body.data_key) {
    let res
    let allItems
    const db = Deta().Base('discollection_keys')
    const datakey = await db.put(body.data_key)
    if (datakey) {
      res = await db.fetch()
      allItems = res.items
      while (res.last) {
        res = await db.fetch({}, { last: res.last })
        allItems = allItems.concat(res.items)
      }
      return allItems
    } else return null
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Your POST body is missing: "data_key"',
    })
  }
})
