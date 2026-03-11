---
name: playwright
description: Browser automation with Playwright. For simple tasks (navigate, click, screenshot, check elements), use the Playwright MCP tools directly. For complex automation (multi-viewport testing, loops, network interception, data extraction), write scripts. Use when the user wants to test websites, automate browser interactions, validate web functionality, or perform any browser-based task.
---

# Playwright Browser Automation

This skill provides two approaches to browser automation. **Choose the right one for the task.**

## Decision: MCP Tools vs Script

### Use MCP Tools When:
- Navigating to a page and inspecting it
- Clicking elements, filling forms, reading content
- Taking a screenshot of a single page
- Quick interactive exploration ("what's on this page?")
- Any task that's a linear sequence of actions

**MCP tools are available as `mcp__playwright__*` tool calls.** Key tools:
- `browser_navigate` — go to a URL
- `browser_click` — click an element by ref
- `browser_type` — type into a field
- `browser_snapshot` — get accessibility tree (structured page content with element refs)
- `browser_take_screenshot` — capture the page visually
- `browser_tab_list` / `browser_tab_new` / `browser_tab_select` — manage tabs
- `browser_select_option` — interact with dropdowns
- `browser_hover` — hover over elements
- `browser_press_key` — keyboard input
- `browser_wait` — wait for a condition

**MCP workflow:**
1. `browser_navigate` to the URL
2. `browser_snapshot` to see the page structure and get element refs
3. Use refs to `browser_click`, `browser_type`, etc.
4. `browser_take_screenshot` to capture results

### Use Scripts When:
- Testing across multiple viewports (responsive design)
- Looping over elements (broken link checker, table extraction)
- Network interception or API mocking
- Complex multi-step flows with assertions
- Performance measurement
- Anything requiring conditionals, loops, or programmatic logic

**Script workflow** — see [Script Execution](#script-execution) below.

---

## MCP Examples

### Quick page check
```
1. browser_navigate → http://localhost:3000
2. browser_snapshot → read the page structure
3. Report what you see
```

### Fill and submit a form
```
1. browser_navigate → http://localhost:3000/contact
2. browser_snapshot → find form fields and their refs
3. browser_click → [ref for name input]
4. browser_type → "John Doe"
5. browser_click → [ref for email input]
6. browser_type → "john@example.com"
7. browser_click → [ref for submit button]
8. browser_snapshot → verify success message
```

### Screenshot for review
```
1. browser_navigate → http://localhost:3000
2. browser_take_screenshot → saves to file, view the result
```

---

## Script Execution

**Path Resolution:** Determine `$SKILL_DIR` from where this SKILL.md was loaded.

### Setup (First Time)

```bash
cd $SKILL_DIR && npm run setup
```

### Dev Server Detection

For localhost testing, detect servers first:

```bash
cd $SKILL_DIR && node -e "require('./lib/helpers').detectDevServers().then(s => console.log(JSON.stringify(s)))"
```

- **1 server found**: Use it automatically
- **Multiple found**: Ask user which one
- **None found**: Ask for URL or offer to help start dev server

### Writing and Running Scripts

1. Write scripts to `/tmp/playwright-test-*.js` — never to skill directory or user's project
2. Parameterize URLs with a `TARGET_URL` constant at top
3. Use `headless: false` by default (visible browser)
4. Execute: `cd $SKILL_DIR && node run.js /tmp/playwright-test-*.js`

### Script Patterns

#### Responsive Testing (Multiple Viewports)

```javascript
// /tmp/playwright-test-responsive.js
const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3001';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(TARGET_URL);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `/tmp/${vp.name.toLowerCase()}.png`, fullPage: true });
    console.log(`${vp.name} screenshot saved`);
  }

  await browser.close();
})();
```

#### Broken Link Checker

```javascript
const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3001';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(TARGET_URL);

  const links = await page.locator('a[href^="http"]').all();
  const results = { working: 0, broken: [] };

  for (const link of links) {
    const href = await link.getAttribute('href');
    try {
      const response = await page.request.head(href);
      if (response.ok()) results.working++;
      else results.broken.push({ url: href, status: response.status() });
    } catch (e) {
      results.broken.push({ url: href, error: e.message });
    }
  }

  console.log(`Working: ${results.working}, Broken: ${results.broken.length}`);
  if (results.broken.length) console.log('Broken:', JSON.stringify(results.broken, null, 2));
  await browser.close();
})();
```

#### Login Flow with Assertions

```javascript
const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3001';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`${TARGET_URL}/login`);
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  console.log('Login successful, redirected to dashboard');

  await browser.close();
})();
```

### Available Helpers

`lib/helpers.js` provides utilities for scripts:

```javascript
const helpers = require('./lib/helpers');

await helpers.detectDevServers();          // Find running dev servers
await helpers.safeClick(page, selector);   // Click with retry
await helpers.safeType(page, sel, text);   // Type with clear
await helpers.takeScreenshot(page, name);  // Timestamped screenshot
await helpers.handleCookieBanner(page);    // Dismiss cookie banners
await helpers.extractTableData(page, sel); // Extract table as JSON
await helpers.createContext(browser);      // Context with env headers
```

### Custom HTTP Headers

Set headers for all requests via environment variables:

```bash
PW_HEADER_NAME=X-Automated-By PW_HEADER_VALUE=playwright-skill \
  cd $SKILL_DIR && node run.js /tmp/my-script.js
```

Or multiple headers: `PW_EXTRA_HEADERS='{"X-Automated-By":"playwright-skill","X-Debug":"true"}'`

## Advanced Usage

For comprehensive Playwright API docs (selectors, network interception, auth, visual testing, mobile emulation, debugging, CI/CD), see [API_REFERENCE.md](API_REFERENCE.md).

## Troubleshooting

- **Playwright not installed**: `cd $SKILL_DIR && npm run setup`
- **Module not found**: Ensure running from skill directory via `run.js`
- **Browser doesn't open**: Check `headless: false` and display availability
- **Element not found**: Add wait: `await page.waitForSelector('.el', { timeout: 10000 })`
- **MCP tools not available**: Check that the `playwright` MCP server is running (loaded from plugin's `.mcp.json`)
