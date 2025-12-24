import { expect, test } from "bun:test"
import { mockClient } from "../setup.js"
import r6 from "../../src/modules/r6.js"

test("player not found", async () => {
  await r6.execute(mockClient, [
    { value: "fghuiasduiasdfghuiasfhasdf#ahujisdhasdhuiasd" },
  ])
  expect(mockClient.editReplyArgument).toEqual("Player not found.")
})

test("empty stats", async () => {
  await r6.execute(mockClient, [{ value: "T3CHN0.H3H3" }])
  expect(mockClient.editReplyArgument.embeds[0].data.fields[2].value).toEqual(
    "None",
  )
})

test("correct stats", async () => {
  await r6.execute(mockClient, [{ value: "Zonkkey" }])
  expect(
    mockClient.editReplyArgument.embeds[0].data.fields[2].value,
  ).not.toEqual("None")
})
