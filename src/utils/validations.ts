const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

type EmailAndUsername = string;

export const isValidEmail = (email: EmailAndUsername) => {
  return emailRegex.test(email);
};

export const isValidUsername = (username: EmailAndUsername) => {
  return usernameRegex.test(username);
};
