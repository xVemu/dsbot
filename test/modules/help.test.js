import { expect, test } from 'bun:test'
import help from '../../src/modules/help.js'
import { mockClient } from '../setup.js'

test('General', async () => {
  await help.execute(mockClient, [])
  expect(mockClient.replyArgument.content).toEqual(expect.stringContaining('to get info on a specific command'))
})

test('Specific command', async () => {
  await help.execute(mockClient, [{ value: 'poll' }])
  expect(mockClient.replyArgument.content).toEqual(expect.stringContaining('option1 - 1st option - required ✓'))
})

test('Wrong command', async () => {
  await help.execute(mockClient, [{ value: 'wrong' }])
  expect(mockClient.replyArgument.content).toEqual('That\'s not a valid command!')
})


