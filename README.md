# Sacrament Meeting Planner

A Sacrament Meeting Planner built with Next.js, TypeScript, and PostgreSQL. The application provides public meeting information, administrative meeting management, authentication, search, pagination, and API endpoints.

## Getting Started

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The meetings API is available at:

```text
http://localhost:3000/api/meetings
```

## Meetings API

The `GET /api/meetings` endpoint returns sacrament meeting records and supports explicit pagination.

### Query parameters

- `page`: Positive integer representing the requested page. Defaults to `1`.
- `limit`: Positive integer representing the number of records per page. Defaults to `5` and cannot exceed `100`.
- `date`: Optional search value used to filter meetings.

### Example requests

Retrieve the first five meetings:

```text
GET /api/meetings?page=1&limit=5
```

Retrieve the next five meetings:

```text
GET /api/meetings?page=2&limit=5
```

Filter meetings while using pagination:

```text
GET /api/meetings?date=2026-01&page=1&limit=5
```

### Successful response

A successful request returns the meeting records in `data` and pagination information in `pagination`:

```json
{
  "data": [],
  "pagination": {
    "page": 2,
    "limit": 5,
    "totalPages": 2
  }
}
```

Clients can request additional pages to retrieve records beyond the first five meetings.

### Pagination validation

The API validates the pagination parameters.

The following values are invalid:

- `page=0`
- `page=abc`
- `limit=0`
- `limit=101`

An invalid request returns HTTP status `400` with a JSON error response.

Example:

```json
{
  "error": "Invalid pagination parameters.",
  "details": {
    "page": "The page parameter must be a positive integer."
  }
}
```

The `limit` parameter must be between `1` and `100`.

Example limit error:

```json
{
  "error": "Invalid pagination parameters.",
  "details": {
    "limit": "The limit parameter must be a positive integer between 1 and 100."
  }
}
```

## Available Scripts

Run the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Meeting form validation checklist

Use this manual checklist when reviewing the create and edit meeting forms:

1. Submit an empty form and confirm that a summary links to each invalid field.
2. Select a date that is not a Sunday and confirm that it is rejected.
3. Enter a hymn number above `999` and confirm that it is rejected.
4. Enter a speaker without the `Name | Topic` format and confirm that it is rejected.
5. Correct the highlighted fields and confirm that the meeting saves successfully.
6. Confirm that a success message appears on the meetings page after saving.
7. Test the form at a narrow mobile viewport and confirm that every field and action remains usable.

## Technologies

- Next.js
- React
- TypeScript
- PostgreSQL
- Neon Serverless
- NextAuth
- Tailwind CSS
- Vercel

## Deployment

The application is deployed on Vercel:

[https://sacrament-meetings-ochre.vercel.app](https://sacrament-meetings-ochre.vercel.app)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Vercel Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
