import { Deta } from 'deta'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body.data_keys) {
    const db = Deta().Base('discollection-config')
    const datakeys = await db.put(body.data_keys.map(String), 'data_keys')
    return datakeys ? datakeys.value : null
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Data keys should be in an array',
    })
  }
})
