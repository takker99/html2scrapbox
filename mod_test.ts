/// <reference lib="deno.ns"/>
// @deno-types="https://cdn.esm.sh/v45/@types/jsdom@16.2.13/ts4.0/index.d.ts"
import jsdom from "https://dev.jspm.io/jsdom@17.0.0";
import { parse } from "./mod.ts";
const { JSDOM } = jsdom;

Deno.test("太文字変換", () => {
  const doc = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
});
