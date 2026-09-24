# Amelia Shapiro Professional Portfolio

A personal portfolio for Amelia Shapiro, a political science student on the pre-law track at Tulane University.

**Last updated:** 2026-09-24 02:46:28 UTC

[View the portfolio](https://amelia-shapiro-portfolio.ameliashap.chatgpt.site)

The hosted site currently requires owner access through ChatGPT.

## Academic focus

- **Comparative politics:** Current coursework and an interest in comparing political institutions, participation, and outcomes across countries.
- **International relations:** Current coursework and an interest in diplomacy, cooperation, and relationships between states.
- **AI literacy:** An interest in pursuing an AI literacy minor, including AI's limitations, responsible use, and implications for public policy. This is an intended area of study, not a declared or completed minor.
- **Political science and pre-law:** An ongoing interest in government, legal reasoning, and public policy.

The portfolio also includes New York City roots, education and honors, leadership and community service, athletics, software skills, and languages. High school experiences are labeled by grade level and distinguished from current Tulane studies.

## Website

The site uses a dark charcoal and purple palette, responsive layouts, keyboard focus indicators, and expandable academic questions. A bottom contact section accepts a name, email address, and message.

## Contact inbox

Submissions are stored in a Sites D1 database and visible only to the authenticated site owner at `/inbox`. No email notifications are sent. The hosted site remains owner-private; visitors need site access before they can use the form. The inbox is protected separately from the site's sharing settings.

The form validates inputs, preserves text on failure, prevents duplicate retries, and limits repeated submissions. Raw IP addresses are not stored; a hash is used for rate limiting.

## Files and development

- `public/` — Portfolio HTML, contact form JavaScript, and original image assets.
- `worker/index.js` — Contact API, owner-only inbox, and asset serving.
- `db/schema.ts` and `drizzle/` — Database schema and generated migrations.
- `scripts/build.mjs` — Packages the Worker and assets into `dist/`.
- `.openai/hosting.json` — Sites project and D1 binding configuration.
- `tests/contact.test.mjs` — Submission, validation, access, and persistence checks using SQLite.

```sh
npm ci
npm run build
npm test
```

Deploy the generated `dist/` artifact through Sites. It includes the Worker, hosting configuration, and schema migrations for the `DB` binding. Opening `public/index.html` alone previews the design but cannot save messages; submissions need the Worker and database.

## Image credit

The current portrait was supplied by Amelia Shapiro. The attribution below applies only to the retained architectural photograph, which is no longer displayed.

[Municipal Building Facade — New York City](https://commons.wikimedia.org/wiki/File:Municipal_Building_Facade_-_New_York_City.jpg) by Momos, via Wikimedia Commons, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). The image is cropped and displayed in grayscale; the adaptation is offered under the same license.

## Dated change log

All timestamps below are in UTC. New entries should be added above existing entries.

### 2026-09-24 02:46:28 UTC

- Applied a dark charcoal and purple theme with light text, dark study cards and contact fields, and matching inbox colors.
- Preserved the responsive layout and a light print stylesheet.

### 2026-09-24 02:35:06 UTC

- Added a white-and-purple contact form at the bottom with Name, Email, and Message fields.
- Added persistent submissions and a private owner inbox, input validation, and clear success/error states.
- Added backend tests and updated build and database documentation.

### 2026-09-22 15:17:55 UTC

- Added the supplied portrait beside the introduction, preserving the original color and proportions.
- Adjusted portrait sizing for mobile and desktop and added descriptive alternative text.
- Removed the architectural-photo credit from the page because that image is no longer displayed.

### 2026-09-22 14:56:36 UTC

- Refined the white and purple design with clearer academic cards, improved spacing, and a shorter introduction.
- Added direct education and skills navigation with a wrapping mobile layout.
- Highlighted current Tulane studies and three leadership roles; grouped school history and other activities into expandable sections.
- Preserved existing resume details and clarified the GitHub profile link.

### 2026-09-22 14:44:13 UTC

- Added West End Secondary School graduation (June 2026), academic honors, and expandable AP coursework.
- Expanded experience with Girls on the Run, Senior Council leadership, Chess Club, school tours, family farm responsibilities, basketball, Tyathlon, and team management.
- Added software skills and languages, specifying Spanish reading and writing.
- Kept Tulane, the political science major, pre-law track, current classes, and interest in AI literacy prominent.
- Used "starting guard" because the supplied high school résumé lists both point guard and shooting guard.

### 2026-09-22 14:40:30 UTC

- Changed the white and blue palette to white and purple, including accents, backgrounds, links, focus indicators, and the favicon.
- Reworked the introduction and academic section around current comparative politics and international relations coursework.
- Added interest in a future AI literacy minor and related questions about responsible AI use and public policy.
- Updated page descriptions and navigation to reflect the academic focus.
- Expanded this README with project details, local preview instructions, image attribution, and timestamped history.

### 2026-09-17 15:24:53 UTC

- Published the initial portfolio privately on Sites.
- Included background, academic interests, Girls on the Run, mock trial, and a Manhattan photograph.
