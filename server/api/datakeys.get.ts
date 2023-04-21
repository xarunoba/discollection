import { Deta } from 'deta'

export default defineEventHandler(async () => {
  const db = Deta().Base('discollection-config')
  const datakeys = await db.get('data_keys')
  return datakeys ? datakeys.value : null
})
