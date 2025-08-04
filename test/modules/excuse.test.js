import { expect, test } from 'bun:test'
import { mockClient } from '../setup.js'
import excuse from '../../src/modules/excuse.js'

test('api online', async () => {
  await excuse.execute(mockClient)
  expect(mockClient.replyArgument.embeds[0].data.fields[0].value).toBeDefined()
  expect(mockClient.replyArgument.embeds[0].data.fields[1].value).toBeDefined()
})
