# Middleware function auth
## Functionality
- returns middleware checking out security context<br>
- no security context (req.username == null or undefined) exception with 401 code<br>
- - if there is auth_error it should appear in error message<br>
- - if no auth_error the error message should be "Authentication error"<br>
- security context exists<br>
-- if actual role (role in security context doesn't match a configured one) exceptopn with code 403 and message "Authorization Error" should ne thrown
-- if actual role mathches the configured one nothig should be done except calling next function
## Input Parameters
...rolesAllowed: string[] (the configured roles for a given method)<br>
if no roles are passed to the function **auth** it implies that the method may be used for any role
## examples of applying the function **auth**
*auth()* Authentication is required but a method with that middleware may be used for any role
*auth("ACCOUNTS_ROLE", "ADMIN")* A method with that middleware may be used only with roles ACCOUNTS_ROLE or ADMIN. If there is role "USER" the exception 403 should be thrown
## Required Roles Configuration
- Adding Employee, Role: "ADMIN"<br>
- Getting all employees, any role<br>
- Updating Employee, Rloes: "ADMIN" and role of admin for account default ("ACCOUNTS_ADMIN")<br>
- Deleting Employee, Role "ADMIN"<br>
- accounts Login - no authentication<br>
- accounts Adding new account , Role: Role of admin for accounts default ("ACCOUNTS_ADMIN")<br>
- accounts Updating password, any role but only owner of account may update the password or account admin role<br>
- accounts Deleting, Role: Role of admin for accounts default ("ACCOUNTS_ADMIN")<br>

