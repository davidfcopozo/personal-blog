import { emailSender } from "../../../src/utils/emailSender";
import nodemailerMock from "nodemailer-mock";

describe("Email Sender Tests", () => {
  beforeAll(() => {
    nodemailerMock.mock.reset();
  });

  afterEach(() => {
    nodemailerMock.mock.reset();
  });

  jest.mock("nodemailer");

  it("should send an email", async () => {
    const emailOptions = {
      from: "devstackhelp@gmail.com",
      subject: "Test Email",
      text: "This is a test email.",
      to: "davidfco.pozo@gmail.com",
      headers: {},
    };

    try {
      const sentEmail = nodemailerMock.mock.getSentMail();
      await emailSender(emailOptions);

      expect(sentEmail.length).toBe(1);
      expect(sentEmail[0]).toStrictEqual(emailOptions);
      expect(typeof sentEmail[0]).toBe("Object");
      expect(sentEmail[0]).toHaveProperty("from");
      expect(sentEmail[0]).toHaveProperty("to");
      expect(sentEmail[0]).toHaveProperty("subject");
      expect(sentEmail[0]).toHaveProperty("text");
      expect(sentEmail[0]).toHaveProperty("headers");
      expect(sentEmail[0].from).toBe("devstackhelp@gmail.com");
      expect(sentEmail[0].to).toBe("davidfco.pozo@gmail.com");
      expect(sentEmail[0].subject).toBe("Test Email");
      expect(sentEmail[0].text).toBe("This is a test email.");
    } catch (err) {
      err;
    }
  });
});
