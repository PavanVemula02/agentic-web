import { BookingFacts } from "./booking-facts.js";

/**
 * Reads the stay policies from policies.html so the assistant answers from
 * the same policy page visitors can read.
 *
 * Policy text must remain in policies.html rather than being duplicated here.
 * This module requires a browser because it uses fetch and DOMParser.
 */
export class HousePolicies {
  /**
   * Address of the policy page located beside index.html.
   */
  static PAGE = new URL("../policies.html", import.meta.url).href;

  /**
   * Fetch the policy page and return the content of each section.
   *
   * @returns {Promise<{
   *   page: string,
   *   sections: Array<object>
   * }>} Policy page address and parsed sections.
   *
   * @throws {Error} When the policy page cannot be loaded or parsed.
   */
  static async read() {
    const response = await fetch(HousePolicies.PAGE);

    if (!response.ok) {
      throw new Error(
        `The policies page could not be loaded (HTTP ${response.status}).`,
      );
    }

    const html = await response.text();
    const page = new DOMParser().parseFromString(html, "text/html");

    if (!page) {
      throw new Error("The policies page could not be parsed.");
    }

    const sections = [];

    for (const section of page.querySelectorAll("main section")) {
      sections.push(HousePolicies.section(section));
    }

    return {
      page: HousePolicies.PAGE,
      sections,
    };
  }

  /**
   * Describe one policy section, including its heading, text, tables and links.
   *
   * @param {Element} section Policy section element.
   * @returns {{
   *   id: string,
   *   title: string,
   *   text: Array<string>,
   *   tables: Array<Array<Array<string>>>,
   *   links: Array<{text: string, href: string}>
   * }} Structured policy section.
   */
  static section(section) {
    const heading = section.querySelector("h1, h2");
    const text = [];

    for (const item of section.querySelectorAll("h3, p, li")) {
      const value = BookingFacts.plain(item.textContent);

      if (value) {
        text.push(value);
      }
    }

    const tables = [];

    for (const table of section.querySelectorAll("table")) {
      tables.push(HousePolicies.rows(table));
    }

    const links = [];

    for (const link of section.querySelectorAll("a[href]")) {
      links.push({
        text: BookingFacts.plain(link.textContent),
        href: new URL(
          link.getAttribute("href"),
          HousePolicies.PAGE,
        ).href,
      });
    }

    return {
      id: section.id || "introduction",
      title: heading
        ? BookingFacts.plain(heading.textContent)
        : "",
      text,
      tables,
      links,
    };
  }

  /**
   * Read a policy table as lists of cell text, with the header row first.
   *
   * @param {Element} table Policy table element.
   * @returns {Array<Array<string>>} Parsed table rows.
   */
  static rows(table) {
    const rows = [];

    for (const row of table.querySelectorAll("tr")) {
      const cells = [];

      for (const cell of row.querySelectorAll("th, td")) {
        cells.push(BookingFacts.plain(cell.textContent));
      }

      if (cells.length > 0) {
        rows.push(cells);
      }
    }

    return rows;
  }
}