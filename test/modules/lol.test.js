import { expect, test } from 'bun:test'
import { mockClient } from '../setup.js'
import lol from '../../src/modules/lol.js'

test('summoner not found', async () => {
  await lol.execute(mockClient, [{ value: 'fghuiasduiasdfghuiasfhasdf#ahujisdhasdhuiasd' }, { value: 'asdasd' }])
  expect(mockClient.editReplyArgument).toEqual('Summoner not found!')
})

test('api online', async () => {
  await lol.execute(mockClient, [{ value: 'Vemu#2137' }])
  expect(mockClient.editReplyArgument.embeds[0].data.fields[0].value).toEqual('444')
  expect(mockClient.editReplyArgument.embeds[0].data.fields).toBeArrayOfSize(1)
})
