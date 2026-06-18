# Local API examples

Run the app through Vercel CLI so the `/api` functions are available locally:

```bash
npx vercel dev
```

Set `RESEND_API_KEY` and `OPENAI_API_KEY` in your local environment before making
real requests. Do not commit either key.

## Welcome email

```bash
curl --request POST http://localhost:3000/api/send-welcome \
  --header "Content-Type: application/json" \
  --data '{
    "email": "person@example.com",
    "name": "Ada",
    "nationality": "Ukrainian",
    "destinationCountry": "Slovakia",
    "residenceType": "employment"
  }'
```

## Ria chat

```bash
curl --request POST http://localhost:3000/api/ria-chat \
  --header "Content-Type: application/json" \
  --data '{
    "messages": [
      {
        "role": "user",
        "content": "Which documents should I prepare first?"
      }
    ],
    "applicantContext": {
      "nationality": "Ukrainian",
      "destinationCountry": "Slovakia",
      "residenceType": "employment",
      "currentStep": "document preparation"
    }
  }'
```
