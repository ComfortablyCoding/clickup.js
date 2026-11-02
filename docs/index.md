---
layout: home

hero:
  name: "clickup.js"
  text: "A typed client for the ClickUp API"
  tagline: Every v2 and v3 endpoint, generated from ClickUp's OpenAPI specs and corrected against the live API. Runs on Node, Bun, Deno, Workers and in the browser.
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: Examples
      link: /examples

features:
  - title: Every endpoint, typed
    details: Parameters and responses come straight from ClickUp's specs, fixed wherever the live API disagrees. Every method is generated, not hand-written.
  - title: Retries and rate limits
    details: Follows ClickUp's rate limit headers to wait out 429s, and retries safe requests after network and server errors.
  - title: No dependencies
    details: Built only on fetch and other web-standard APIs.
---
