import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import AppTabs from "./AppTabs";

test("renders labelled tabs with Letter selected initially", () => {
  const html = renderToStaticMarkup(<AppTabs memories={[]}><p>Letter</p></AppTabs>);
  expect(html).toContain('aria-label="Chuyển nội dung"');
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain("NHẬT KÝ");
});
