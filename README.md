# Accounting Controller endpoints for AccountingService
## Update app.ts module
### add controller endpoint relevant methods for triggering AccountingService 
#### POST for adding account
- Zod validation of adding account with password syntax validation: minimal length is 8 characters
#### POST for login
- Why POST: because each time there will be issued different JWT and login data should be inside HTTP request
- Zod validation of login data, 
#### PATCH for updating password
- Zod validation is the same as for login
#### DELETE for deleteing account
### Run sanity test 
- Received token may be tested at site https://www.jwt.io/ 
