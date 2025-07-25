import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import { TextEncoder, TextDecoder } from "util";

fetchMock.enableMocks();

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  // @ts-expect-error: Adding TextDecoder polyfill to global scope
  global.TextDecoder = TextDecoder;
}
