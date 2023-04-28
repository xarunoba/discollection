import { Deta } from 'deta'

export default defineEventHandler(async () => {
  const db = Deta().Base('discollection_keys')
  let res = await db.fetch()
  let allItems = res.items

  while (res.last) {
    res = await db.fetch({}, { last: res.last })
    allItems = allItems.concat(res.items)
  }
  return allItems ? allItems : null
})
