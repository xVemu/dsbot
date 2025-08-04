import { expect, test } from 'bun:test'
import animal from '../../src/modules/animal.js'
import { mockClient } from '../setup.js'

test.each(['cat', 'dog', 'duck', 'fox'])('api online', async (type) => {
  await animal.execute(mockClient, [{ value: type }])
  expect(mockClient.editReplyArgument.files[0]).toBeDefined()
})
