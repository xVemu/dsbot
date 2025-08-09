import { expect, test } from "bun:test"
import { mockClient } from "../setup.js"
import fact from "../../src/modules/fact.js"

test.each(["cat", "dog", "useless"])("api online", async type => {
  await fact.execute(mockClient, [{ value: type }])
  expect(mockClient.replyArgument.embeds[0].data.description).toBeDefined()
})
