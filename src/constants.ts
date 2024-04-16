export const SERVICES = [
  "august-alarm-service",
  "august-rest-api",
  "august-subscription-server",
  "subscription-frontend",
];

export const LIBS = [
  "august-constants",
  "august-babelfish",
  "august-model",
  "august-messages",
];

export const XLIFF_STATES = [
  "needs-translation",
  "needs-review-translation",
  "translated",
  "final",
].reduce((acc, state) => [...acc, `+${state}`, `-${state}`], [] as string[]);
