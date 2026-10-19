import { expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

mock.module("next/navigation", () => ({ useRouter: () => ({ refresh() {} }) }));
const { default: Diary } = await import("./Diary");

test("renders a memory article and editor unlock field", () => {
  const html = renderToStaticMarkup(<Diary memories={[{ id: "c123456789012345678901234", title: "Lần đầu gặp", note: "Trời mưa.", occurredAt: "2026-10-16T00:00:00.000Z", createdAt: "2026-10-16T00:00:00.000Z", updatedAt: "2026-10-16T00:00:00.000Z", images: [{ id: "c123456789012345678901235", url: "https://example.com/photo.jpg", pathname: "memories/x/photo.jpg", alt: "Buổi gặp đầu" }] }]} />);
  expect(html).toContain("<article");
  expect(html).toContain('alt="Buổi gặp đầu"');
  expect(html).toContain('type="password"');
});
