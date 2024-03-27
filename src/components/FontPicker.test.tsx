import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { FontPicker } from "./FontPicker";

describe("FontPicker", () => {
  vi.mock("./useFonts", () => ({
    useFonts: () => new Set(["Roboto", "Inter"]),
  }));
  test("FontPicker is defined", () => {
    expect(FontPicker).toBeDefined();
  });

  test("FontPicker renders with default font", () => {
    const font = "Roboto";
    const setFont = vi.fn();
    const { getByText } = render(<FontPicker font={font} setFont={setFont} />);

    expect(getByText(font)).toBeDefined();
  });

  test("FontPicker default matches snapshot", () => {
    const font = "Roboto";
    const setFont = vi.fn();
    const rendered = render(<FontPicker font={font} setFont={setFont} />);

    expect(rendered.asFragment()).toMatchSnapshot();
  });
});
