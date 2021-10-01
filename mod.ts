/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="dom"/>

export interface ConvertOption {
  /** 変換対象のDOMのselector */ selector: string;
  /** `selector`で指定したDOMを任意のテキストに変換する
   * @param textContent `selector`で指定したDOMの`textContent`
   * @param element `selector`で指定したDOM
   */
  replaceToText?: (textContent: string, element: Element) => string;
  /** `selector`で指定したDOMを別のDOMに変換する
   * @param element `selector`で指定したDOM
   */
  replaceToDOM?: (element: Element) => Element;
}
export interface ParseOption {
  /** 解析するHTML文字列 or DOMの基準となるURL */ baseURL?: string | URL;
}

export function parse(
  input: string | HTMLElement,
  converter: ConvertOption[],
  { baseURL }: ParseOption,
) {
  const dom = typeof input === "string"
    ? (() => {
      const _dom = new DOMParser().parseFromString(input, "text/html");
      if (baseURL !== undefined) {
        _dom.head.insertAdjacentHTML("beforeend", `<base href="${baseURL}">`);
      }
      return _dom.body as HTMLBodyElement;
    })()
    : input;

  // configに基づいてHTMLを変換する
  for (const { selector, replaceToText, replaceToDOM } of converter) {
    if (replaceToDOM) {
      dom.querySelectorAll(selector).forEach((element) =>
        element.replaceWith(replaceToDOM(element))
      );
      continue;
    }
    if (replaceToText) {
      dom.querySelectorAll(selector)
        .forEach((element) =>
          element.textContent = replaceToText(
            element.textContent ?? "",
            element,
          )
        );
      continue;
    }
    dom.querySelectorAll(selector).forEach((element) =>
      element.textContent = ""
    );
  }

  // DOMを実体化して、テキスト形式でコピペする
  document.body.appendChild(dom);
  const range = document.createRange();
  range.selectNode(dom);
  const text = dom.innerText;
  document.body.removeChild(dom); // 後始末

  // 何の変換処理だっけこれ？
  return text.replace(/(\s*\n){3,}/g, "\n\n");
}
