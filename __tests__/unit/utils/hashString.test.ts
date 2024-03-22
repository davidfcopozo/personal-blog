import { hashString } from "../../../src/utils/hashString";

describe("Hash String Tests", () => {
  it("should hash a string", () => {
    const string = "test";
    const hashedString = hashString(string);

    expect(typeof hashedString).toBe("string");
    expect(hashedString).not.toBe(string);
    expect(hashedString).toHaveLength(64);
  });
});
