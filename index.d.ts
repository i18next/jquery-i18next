import type { i18n, TFunction, TOptions } from 'i18next';

export interface InitOptions {
  /**
   * Name of the translation function attached to jQuery (e.g. `$.t`).
   * @default 't'
   */
  tName?: string;
  /**
   * Name of the i18next instance attached to jQuery (e.g. `$.i18n`).
   * @default 'i18n'
   */
  i18nName?: string;
  /**
   * Name of the localize handle attached to jQuery (e.g. `$(selector).localize(opts)`).
   * @default 'localize'
   */
  handleName?: string;
  /**
   * Selector attribute used to find elements to translate.
   * @default 'data-i18n'
   */
  selectorAttr?: string;
  /**
   * `data-` attribute used to grab the target element to translate (if different than itself).
   * @default 'i18n-target'
   */
  targetAttr?: string;
  /**
   * `data-` attribute that contains translation options. Loaded/set when `useOptionsAttr` is `true`.
   * @default 'i18n-options'
   */
  optionsAttr?: string;
  /**
   * Whether to read translation options from the `optionsAttr` data attribute.
   * @default false
   */
  useOptionsAttr?: boolean;
  /**
   * Parses default values from element content (`ele.val()` or `ele.text()`).
   * @default true
   */
  parseDefaultValueFromContent?: boolean;
}

/**
 * Initializes the jquery-i18next plugin, wiring an i18next instance into jQuery.
 *
 * Attaches `$.t`, `$.i18n` and the `$(selector).localize(opts)` handle (names are
 * configurable via `options`).
 */
export function init(i18next: i18n, $: JQueryStatic, options?: InitOptions): void;

declare const jqueryI18next: {
  init: typeof init;
};

export default jqueryI18next;
export as namespace jqueryI18next;

declare global {
  interface JQueryStatic {
    /** Shortcut to `i18next.t`, attached by jquery-i18next (default `tName`). */
    t: TFunction;
    /** The i18next instance, attached by jquery-i18next (default `i18nName`). */
    i18n: i18n;
  }

  interface JQuery {
    /** Localizes the matched element(s) and their `data-i18n` children (default `handleName`). */
    localize(options?: TOptions): this;
  }
}
