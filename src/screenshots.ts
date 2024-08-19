import puppeteer, { Page } from "puppeteer";
import fs from "fs/promises";
import config from "./config";

const DIR = "dump/screenshots";

(async () => {
  // Create the screenshot directory
  // await fs.rm(DIR, { recursive: true, force: true });
  // await fs.mkdir(DIR, { recursive: true });

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 393, height: 1200 },
  });
  const page = await browser.newPage();

  await navigateToDevices(page);
  await page.screenshot({ path: `${DIR}/devices.png` });

  await newSubscription(page);
  await editAlarmPlan(page);
  // await editCameraPlan(page);
  // await editSecurePlan(page);
  // await editSecureProPlan(page);

  await browser.close();
})();

async function navigateToDevices(page: Page) {
  const { baseUrl, manageToken } = config.screenshots.subscriptions;
  await page.goto(`${baseUrl}/#/devices?manageToken=${manageToken}`);
  await page.waitForNetworkIdle();
}

async function pageClick(page: Page, ...path: string[]) {
  await Promise.all([
    page.click(["xpath/", ...path].join("")),
    page.waitForNetworkIdle(),
  ]);
}

async function pageHasElem(page: Page, ...xpath: string[]) {
  const elem = await page.$("xpath/" + xpath.join(""));
  return Boolean(elem);
}

async function newSubscription(page: Page) {
  await navigateToDevices(page);

  const xpath = ["//div[contains(text(), 'Explore subscription')]"];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No subscription button found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/plans.png` });

  await newAlarmPlan(page);
  await newCameraPlan(page);
  await newSecurePlan(page);
  // await newSecureProPlan(page);
}

async function newAlarmPlan(page: Page) {
  await page.reload();
  await page.waitForNetworkIdle();

  const xpath = [
    "//h2[text()='Alarm Plan']",
    "/ancestor::div",
    "/following-sibling::div",
    "/button",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No new alarm plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/plan-alarm-plan.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/order-alarm-plan.png` });
}

async function newCameraPlan(page: Page) {
  await page.reload();
  await page.waitForNetworkIdle();

  const xpath = [
    "//h2[text()='Camera Plan']",
    "/ancestor::div",
    "/following-sibling::div",
    "/button",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No new camera plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/plan-camera-plan.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/order-camera-plan.png` });
}

async function newSecurePlan(page: Page) {
  await page.reload();
  await page.waitForNetworkIdle();

  const xpath = [
    "//h2[text()='Secure Plan']",
    "/ancestor::div",
    "/following-sibling::div",
    "/button",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No new secure plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/plan-secure-plan.png` });
  await pageClick(page, "//button[text()='Continue']");

  // await page.screenshot({ path: `${DIR}/redundant-subscriptions-new.png` });
  // await pageClick(page, "//button[text()='Agree']");

  await page.screenshot({ path: `${DIR}/contacts-new.png` });
  await page.type("#emergencyContacts\\[0\\]\\.firstName", "John");
  await page.type("#emergencyContacts\\[0\\]\\.lastName", "Doe");
  await page.type("#emergencyContacts\\[0\\]\\.phone", "33333333");
  await page.screenshot({ path: `${DIR}/contacts-new-filled.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/order-secure-plan.png` });
}

async function newSecureProPlan(page: Page) {
  await page.reload();
  await page.waitForNetworkIdle();

  const xpath = [
    "//h2[text()='Secure Pro Plan']",
    "/ancestor::div",
    "/following-sibling::div",
    "/button",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No new secure pro plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/plan-secure-pro-plan.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/redundant-subscriptions-new.png` });
  await pageClick(page, "//button[text()='Agree']");

  await page.screenshot({ path: `${DIR}/home-address-new.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/home-address-new-required.png` });
  await page.type("#siteName", "John Doe");
  await page.type("#siteAddress1", "123 Main St");
  await page.type("#cityName", "Anytown");
  await page.type("#zipCode", "12345");
  await page.screenshot({ path: `${DIR}/home-address-new-filled.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/contacts-new.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/contacts-new-required.png` });
  await page.type("#emergencyContacts\\[0\\]\\.firstName", "John");
  await page.type("#emergencyContacts\\[0\\]\\.lastName", "Doe");
  await page.type("#emergencyContacts\\[0\\]\\.phone", "1234567890");
  await page.screenshot({ path: `${DIR}/contacts-new-filled.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/security-phrase-new.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/security-phrase-new-required.png` });
  await page.type("#codeword", "1234");
  await page.type("#codewordConfirm", "1234");
  await page.screenshot({ path: `${DIR}/security-phrase-new-filled.png` });
  await pageClick(page, "//button[text()='Continue']");

  await page.screenshot({ path: `${DIR}/order-secure-pro-plan.png` });
}

async function editAlarmPlan(page: Page) {
  await navigateToDevices(page);

  const xpath = [
    "//div[text()='Alarm Plan']",
    "/following-sibling::div[contains(@class, 'active')]",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No active alarm plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/edit-alarm-plan.png` });
  await pageClick(page, "//button[text()='Cancel subscription']");

  await page.screenshot({ path: `${DIR}/cancel-alarm-plan.png` });
  await pageClick(page, "//button[text()='Close']");
}

async function editCameraPlan(page: Page) {
  await navigateToDevices(page);

  const xpath = [
    "//div[text()='Camera Plan']",
    "/following-sibling::div[contains(@class, 'active')]",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No active camera plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/edit-camera-plan.png` });
  await pageClick(page, "//button[text()='Cancel subscription']");

  await page.screenshot({ path: `${DIR}/cancel-camera-plan.png` });
  await pageClick(page, "//button[text()='Close']");
}

async function editSecurePlan(page: Page) {
  await navigateToDevices(page);

  const xpath = [
    "//div[text()='Secure Plan']",
    "/following-sibling::div[contains(@class, 'active')]",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No active secure plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/edit-secure-plan.png` });
  await pageClick(page, "//button[text()='Cancel subscription']");

  await page.screenshot({ path: `${DIR}/cancel-secure-plan.png` });
  await pageClick(page, "//button[text()='Close']");

  await pageClick(page, "//p[text()='Contacts']");
  await page.screenshot({ path: `${DIR}/contacts-edit.png` });
}

async function editSecureProPlan(page: Page) {
  await navigateToDevices(page);

  const xpath = [
    "//div[text()='Secure Pro Plan']",
    "/following-sibling::div[contains(@class, 'active')]",
  ];
  if (!(await pageHasElem(page, ...xpath))) {
    console.log("No active secure pro plan found");
    return;
  }

  await pageClick(page, ...xpath);

  await page.screenshot({ path: `${DIR}/edit-secure-pro-plan.png` });
  await pageClick(page, "//button[text()='Cancel subscription']");
  await page.screenshot({ path: `${DIR}/cancel-secure-pro-plan.png` });

  await page.reload();
  await page.waitForNetworkIdle();
  await pageClick(page, "//p[text()='Contacts']");
  await page.screenshot({ path: `${DIR}/contacts-edit.png` });

  await page.reload();
  await page.waitForNetworkIdle();
  await pageClick(page, "//p[text()='Home Address']");
  await page.screenshot({ path: `${DIR}/home-address-edit.png` });

  await page.reload();
  await page.waitForNetworkIdle();
  await pageClick(page, "//p[text()='Security Phrase']");
  await page.screenshot({ path: `${DIR}/security-phrase-edit-show.png` });
  await pageClick(page, "//p[text()='Tap to view Security Phrase']");
  await page.screenshot({ path: `${DIR}/security-phrase-edit-hide.png` });
  await pageClick(page, "//button[text()='Change Security Phrase']");
  await page.screenshot({ path: `${DIR}/security-phrase-edit-change.png` });
}
