# Theme Fix Progress

- Public theme URLs use `slug` instead of the database UUID.
- Demo lookup uses active theme slug.
- Registration/login preserve the selected theme through auth redirects.
- OAuth/email callback only accepts internal `/dashboard` destinations.
