import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { mockClient } from '../setup.js'
import move, { __testChannel } from '../../src/modules/move.js'
import { ChannelType } from 'discord.js'
import { promisify } from 'util'

const member = {
  voice: {
    selfDeaf: true,
    setChannel: mock(),
  },
}

beforeEach(() => {
  mockClient.reply.mockImplementation(async () => ({ interaction: { id: 1234 } }))
  mockClient.guild = {
    afkChannel: {},
  }
})

describe('early fail', () => {
  test('Is not deafen', async () => {
    const member = {
      voice: {
        selfDeaf: false,
      },
    }

    await move.execute(mockClient, [{ member }])
    expect(mockClient.replyArgument.content).toEqual('User isn\'t self deafen!')
  })

  test('Can\'t find channel', async () => {
    mockClient.guild = {
      channels: {
        cache: [],
      },
    }

    await move.execute(mockClient, [{ member }])
    expect(mockClient.replyArgument.content).toEqual('Haven\'t found right channel!')
  })

  test('Missing permissions', async () => {
    member.voice.setChannel.mockImplementationOnce(() => { throw new Error('Missing Permissions') })

    await move.execute(mockClient, [{ member }])
    expect(mockClient.editReplyArgument.content).toEqual('I haven\'t enough permissions to move user!')
  })
})

describe('findChannel', () => {
  const textChannel = {
    type: ChannelType.GuildText,
    permissionsFor: () => ({ has: () => false }),
    members: {
      size: 0,
    },
  }

  const noPermissionChannel = {
    type: ChannelType.GuildVoice,
    permissionsFor: () => ({ has: () => false }),
    members: {
      size: 0,
    },
  }

  const almostFullChannel = {
    type: ChannelType.GuildVoice,
    permissionsFor: () => ({ has: () => true }),
    members: {
      size: 2,
    },
  }

  const fullChannel = {
    type: ChannelType.GuildVoice,
    permissionsFor: () => ({ has: () => true }),
    members: {
      size: 12,
    },
  }

  const emptyChannel = {
    type: ChannelType.GuildVoice,
    permissionsFor: () => ({ has: () => true }),
    members: {
      size: 0,
    },
  }

  const member = {
    voice: {
      channel: fullChannel,
    },
  }

  test('afk channel', async () => {
    const res = __testChannel({}, { afkChannel: 'asd' })

    expect(res).toEqual('asd')
  })

  test('empty channel', async () => {
    const guild = {
      afkChannel: null,
      channels: {
        cache: [
          textChannel,
          noPermissionChannel,
          almostFullChannel,
          fullChannel,
          emptyChannel,
        ],
      },
    }

    const res = __testChannel(member, guild)
    expect(res).toEqual(emptyChannel)
  })

  test('second best', async () => {
    const guild = {
      afkChannel: null,
      channels: {
        cache: [
          textChannel,
          noPermissionChannel,
          fullChannel,
          almostFullChannel,
        ],
      },
    }

    const res = __testChannel(member, guild)
    expect(res).toEqual(almostFullChannel)
  })

  test('find none', async () => {
    const guild = {
      afkChannel: null,
      channels: {
        cache: [
          textChannel,
          noPermissionChannel,
          fullChannel,
        ],
      },
    }

    const res = __testChannel(member, guild)
    expect(res).toBeUndefined()
  })
})

const sleep = promisify(setTimeout)

describe('stopped', async () => {
  const member = {
    voice: {
      selfDeaf: true,
      channel: 'original',
      setChannel: mock(),
    },
  }

  beforeEach(() => {
    member.voice.selfDeaf = true
  })

  test('stop button', async () => {
    const promise = move.execute(mockClient, [{ member }])

    await sleep(3562)
    expect(mockClient.client.movingSet.size).toEqual(1)

    mockClient.client.movingSet.delete(1234)
    await promise

    expect(mockClient.client.movingSet).toBeEmpty()
    expect(member.voice.setChannel).toHaveBeenCalledTimes(1 + 3 + 1)
  }, 5000)

  test('undeafen', async () => {
    const promise = move.execute(mockClient, [{ member }])

    await sleep(3562)
    expect(mockClient.client.movingSet.size).toEqual(1)

    member.voice.selfDeaf = false
    await promise

    expect(mockClient.client.movingSet).toBeEmpty()
    expect(member.voice.setChannel).toHaveBeenCalledTimes(1 + 3 + 1)
  }, 5000)

  test('left server', async () => {
    const promise = move.execute(mockClient, [{ member }])

    await sleep(3562)
    expect(mockClient.client.movingSet.size).toEqual(1)

    member.voice.setChannel.mockImplementationOnce(() => { throw new Error('Target user is not connected to voice.') })
    await promise

    expect(mockClient.client.movingSet).toBeEmpty()
    expect(member.voice.setChannel).toHaveBeenCalledTimes(1 + 3 + 1)
    expect(mockClient.deleteReply).toBeCalled()
  }, 5000)
})
