import { isValidEmail, isValidUsername } from "../../../src/utils/validators";

describe("validators", () => {
  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(isValidEmail("example@gmail.com")).toBe(true);
      expect(isValidEmail("example@co.uk")).toBe(true);
      expect(isValidEmail("example@co.online")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(isValidEmail("example.gmail")).toBe(false);
      expect(isValidEmail("example@gmail")).toBe(false);
      expect(isValidEmail("example@gmail.")).toBe(false);
      expect(isValidEmail("example@gmail.c")).toBe(false);
      expect(isValidEmail("@gmail.c")).toBe(false);
      expect(isValidEmail("@gmail.com")).toBe(false);
    });
  });

  describe("isValidUsername", () => {
    it("should return true for valid usernames", () => {
      expect(isValidUsername("example")).toBe(true);
      expect(isValidUsername("ex_ample")).toBe(true);
      expect(isValidUsername("ex_ample100")).toBe(true);
      expect(isValidUsername("ex_ample_100")).toBe(true);
      expect(isValidUsername("ex-ample_100")).toBe(true);
    });

    it("should return false for invalid usernames", () => {
      expect(isValidUsername("ex")).toBe(false);
      expect(isValidUsername("ex.ample")).toBe(false);
      expect(isValidUsername("ex--ample")).toBe(false);
      expect(isValidUsername("ex__ample")).toBe(false);
      expect(isValidUsername(".example")).toBe(false);
      expect(isValidUsername("-example")).toBe(false);
      expect(isValidUsername("_example")).toBe(false);
      expect(isValidUsername("example_")).toBe(false);
      expect(isValidUsername("example-")).toBe(false);
      expect(isValidUsername("example.")).toBe(false);
    });
  });
});
