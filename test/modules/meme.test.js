import { expect, mock, spyOn, test } from 'bun:test'
import { mockClient } from '../setup.js'
import meme from '../../src/modules/meme.js'

test('nsfw', async () => {
  const originalFetch = global.fetch

  const mockFetch = mock(fetch).mockResolvedValueOnce({
    json: () => Promise.resolve({
      nsfw: true,
      url: 'https://i.imgur.com/123.jpg',
      title: 'title',
    }),
  })

  global.fetch = mockFetch

  const deferred = spyOn(mockClient, 'deferred')
  await meme.execute(mockClient)
  expect(deferred).toHaveBeenCalledTimes(2)

  global.fetch = originalFetch
  mockFetch.mockRestore()
})

test('api online', async () => {
  await meme.execute(mockClient)
  expect(mockClient.editReplyArgument.files[0]).toBeDefined()
  expect(mockClient.editReplyArgument.content).toBeDefined()
})
