import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { Payload } from '../index.js'
import type { PayloadRequestWithData } from '../types/index.js'

type Args = {
  collectionConfig: SanitizedCollectionConfig
  /**
   * User IDs to delete
   */
  ids: (number | string)[]
  payload: Payload
  req: PayloadRequestWithData
}
export const deleteUserPreferences = async ({ collectionConfig, ids, payload, req }: Args) => {
  if (collectionConfig.auth) {
    await payload.db.deleteMany({
      collection: 'payload-preferences',
      req,
      where: {
        and: [
          {
            'user.value': { in: ids },
          },
          {
            'user.relationTo': { equals: collectionConfig.slug },
          },
        ],
      },
    })
  }
  await payload.db.deleteMany({
    collection: 'payload-preferences',
    req,
    where: {
      key: { in: ids.map((id) => `collection-${collectionConfig.slug}-${id}`) },
    },
  })
}
