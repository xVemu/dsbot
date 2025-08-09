import { beforeEach, jest, mock } from "bun:test"
import { Glob } from "bun"

beforeEach(() => {
  jest.clearAllMocks()
})

export const mockClient = {
  reply: mock(),
  editReply: mock(),
  deferReply: mock(),
  deleteReply: mock().mockResolvedValue(),
  deferred: false,
  get replyArgument() {
    return this.reply.mock.calls[0][0]
  },
  get editReplyArgument() {
    return this.editReply.mock.calls[0][0]
  },
  client: {
    cmds: new Map(),
    movingSet: new Set(),
  },
  channel: {
    nsfw: false,
  },
}

for await (const file of new Glob("*.js").scan("src/modules")) {
  const { default: cmd } = await import(`../src/modules/${file}`)
  mockClient.client.cmds.set(cmd.name, cmd)
}
