const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const usernameRegex =
  /^(?=[a-zA-Z])[a-zA-Z0-9]*[_-]?[a-zA-Z0-9]+[_-]?[a-zA-Z0-9]{3,}$/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const websiteRegex =
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([\/\w \.-]*)*\/?$/;
const topicNameRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9-_ ]{0,48}[a-zA-Z0-9]+$/;
const topicDescriptionRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9-_ ]{5,96}[a-zA-Z0-9]+$/;
const categoryNameRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9-_ ]{0,48}[a-zA-Z0-9]+$/;

type StringProp = string;

export const isValidEmail = (email: StringProp) => {
  return emailRegex.test(email);
};

export const isValidUsername = (username: StringProp) => {
  return usernameRegex.test(username);
};

export const slugValidator = (slug: StringProp) => {
  return slugRegex.test(slug);
};

export const websiteValidator = (web: StringProp) => {
  return websiteRegex.test(web);
};

export const topicNameValidator = (topic: StringProp) => {
  return topicNameRegex.test(topic);
};

export const topicDescriptionValidator = (description: StringProp) => {
  return topicDescriptionRegex.test(description);
};

export const categoryValidator = (name: StringProp) => {
  return categoryNameRegex.test(name);
};
