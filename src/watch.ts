import { clearTerminal } from "./utils";

const WATCH_INTERVAL_MINUTES = 1;

(async () => {
  clearTerminal();
  console.log("-- watching --");

  const { prs } = await import("./prs");
  // const { newTags } = await import("./tags");
  // const { newDEPs } = await import("./deps");

  setInterval(prs, 1000 * 60 * WATCH_INTERVAL_MINUTES);
  // setInterval(newTags, 1000 * 60 * WATCH_INTERVAL_MINUTES);
  // setInterval(newDEPs, 1000 * 60 * WATCH_INTERVAL_MINUTES);
})();
