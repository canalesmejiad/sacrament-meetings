# Sacrament Meeting Planner

A web application for bishopric members and ward members to prepare and review sacrament meeting programs. Public visitors can browse meetings, search the archive, review program details, and print programs. Authenticated administrators manage meetings and a separate hymn catalog.

## Project and team

- Developer: David Eduardo Canales. This project is completed individually with the instructor's permission.
- Repository: https://github.com/canalesmejiad/sacrament-meetings
- Production: https://sacrament-meetings-ochre.vercel.app
- Workflow: feature branches, pull requests, reviews, and integration into `main`.

## Features and architecture

- Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL on Neon, and Vercel.
- Auth.js v5 with a Credentials provider, bcrypt password verification, and JWT sessions.
- Public views: home, meeting archive, meeting details, and current meeting.
- Protected administration: create, edit, and delete meetings; create, list, edit, and delete catalog hymns.
- Meeting programs contain hymn details, prayers, announcements, ward business, and speakers.
- The independent `hymns` table stores catalog entries with an ID, unique number, and title.
- `components/MeetingsList.tsx` fetches `/api/meetings` from the browser. The route handler calls `lib/meetings-db.ts`, which queries PostgreSQL. Search and pagination use this flow.
- Server Actions validate administrative submissions before writing to PostgreSQL.
- Controlled form fields preserve entered values after failed submissions. Linked error summaries, field messages, loading states, retry actions, and success messages help users complete tasks.

## Local setup

1. Clone the repository and install its dependencies:

```bash
git clone https://github.com/canalesmejiad/sacrament-meetings.git
cd sacrament-meetings
npm install
```

2. Create a Neon PostgreSQL database. Run the SQL below in its SQL Editor to provision a new installation. This is a compatible setup schema based on the application's columns; `IF NOT EXISTS` does not migrate an existing table or change its constraints.

```sql
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    meeting_type VARCHAR NOT NULL,
    presiding VARCHAR NOT NULL,
    conducting VARCHAR NOT NULL,
    announcements TEXT[] DEFAULT '{}',
    opening_hymn JSONB NOT NULL,
    opening_prayer VARCHAR NOT NULL,
    ward_business JSONB DEFAULT '[]'::jsonb,
    stake_business BOOLEAN DEFAULT false,
    sacrament_hymn JSONB NOT NULL,
    speakers JSONB DEFAULT '[]'::jsonb,
    closing_hymn JSONB NOT NULL,
    closing_prayer VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS hymns (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 999),
    title VARCHAR(150) NOT NULL CHECK (char_length(trim(title)) > 0)
);
```

Hymn objects in meeting records use `{ "number": 3, "title": "Now Let Us Rejoice" }`. Speakers use objects with `name`, `topic`, and `type`; ward business items use `description`. A new installation starts with empty tables. Sign in and create records through the application.

3. Create `.env.local` at the project root with these variables:

```dotenv
DATABASE_URL="YOUR_NEON_CONNECTION_STRING"
AUTH_SECRET="YOUR_RANDOM_AUTH_SECRET"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="YOUR_BCRYPT_PASSWORD_HASH"
```

Use the Neon connection string for the selected branch and database, including its SSL options. Generate a random secret:

```bash
node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64"))'
```

Generate the administrator password hash. Replace the example password before running this command and use that password to sign in:

```bash
node -e 'console.log(require("bcryptjs").hashSync("REPLACE_WITH_A_DEMO_PASSWORD", 12))'
```

Store the resulting hash as `ADMIN_PASSWORD_HASH`, not the plaintext password. Keep `.env.local` out of version control. Demo credentials for the deployed application should be provided to the grader through the submission rather than publishing secrets in this README.

4. Start development:

```bash
npm run dev
```

Open http://localhost:3000. Visit `/login` with the configured administrator credentials. Public meeting pages require no sign-in. Meeting administration and `/hymns` require authentication.

## Deployment

1. Import the GitHub repository into Vercel as a Next.js project.
2. Configure `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` for the environments that will run the app.
3. Provision both tables in the database used by each environment.
4. Set the production branch to `main`. Feature branches provide Preview deployments for verification before merging.
5. Deploy or redeploy after changing environment variables. Check sign-in, meeting browsing, and hymn management on the resulting URL.

## Meetings API

`GET /api/meetings` returns public meeting records from PostgreSQL.

| Parameter | Behavior |
| --- | --- |
| `page` | Positive integer; defaults to `1`. |
| `limit` | Integer from `1` to `100`; defaults to `5`. |
| `date` | Optional search string. Despite its name, it searches dates, meeting types, presiding/conducting names, and speakers. |

Examples:

```text
GET /api/meetings?page=1&limit=5
GET /api/meetings?page=2&limit=5
GET /api/meetings?date=Thompson&page=1&limit=5
```

Response shape:

```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 5, "totalPages": 0 }
}
```

Invalid pagination returns HTTP `400` with `error` and `details`. Validation rejects unsafe pagination offsets. The browser list handles failed requests with a message and a retry button. The repository also contains a meeting-by-ID route handler at `/api/meetings/[id]`.

## Verification

Run code checks and the production build:

```bash
npm run lint
npx tsc --noEmit
npx next build --webpack
```

Use `npm start` to run a completed production build locally.

Manual checks completed during development:

- Meeting create and edit forms retain entered values after repeated validation failures; this was also verified on the deployed site after PR #8.
- An empty date shows only its required-field message. A Monday is rejected and a Sunday is accepted by date validation.
- Error-summary links target their fields.
- Meeting search filters results and clearing the search restores the list.
- Browser Network inspection confirms requests from `MeetingsList.tsx` to the meetings API, including page 2, with HTTP `200`.
- Local hymn CRUD: create, display, update, and delete, with success feedback.
- Duplicate hymn numbers are rejected while preserving entered values.
- Unauthenticated access to the hymn catalog redirects to sign-in.

Additional regression checks before delivery:

1. Check meeting create, update, and delete success paths using a temporary record.
2. Reject hymn numbers outside `1–999`, malformed speaker lines, and oversized text.
3. Cancel hymn deletion and confirm the record remains; confirm deletion and verify removal.
4. Check the create and edit forms at a narrow viewport and with keyboard navigation.
5. Verify the new catalog and API-driven list on the final production deployment.
6. Record mobile Lighthouse Performance, Accessibility, Best Practices, and SEO scores from production, plus CSS Overview contrast results. Include measured scores in the final submission.

## Known limitations and opportunities

- Authentication supports one administrator configured through environment variables; there is no public registration or multi-user role management.
- Catalog hymns serve as a reference. Meeting hymn numbers and titles are entered manually; catalog changes do not automatically update existing meeting programs.
- Hymn catalog entries have no automatic seed data or search/pagination yet.
- The API search parameter is named `date` even though it supports broader text searches.
- The project uses documented manual behavior checks rather than a comprehensive automated test suite.
- Lighthouse scores and AA/AAA contrast compliance must be measured on the final deployment; passing compilation alone does not establish these results.
