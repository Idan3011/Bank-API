
## API Endpoints

### Get All Users

- **Endpoint:** `/`
- **Method:** GET
- **Description:** Retrieve details of all users in the bank.

### Create User

- **Endpoint:** `/`
- **Method:** POST
- **Description:** Add a new user to the bank.

### Get Users by Total Money

- **Endpoint:** `/:totalMoney`
- **Method:** GET
- **Description:** Filter users based on a specific amount of money.

### Get User by ID

- **Endpoint:** `/id/:id`
- **Method:** GET
- **Description:** Retrieve user details by their unique ID.

### Cash Deposit

- **Endpoint:** `/:id/cashDeposit`
- **Method:** PUT
- **Description:** Deposit cash to a user's account.

### Credit Deposit

- **Endpoint:** `/:id/creditDeposit`
- **Method:** PUT
- **Description:** Deposit credit to a user's account.

### Cash Withdraw

- **Endpoint:** `/:id/cashwithdraw`
- **Method:** PUT
- **Description:** Withdraw cash from a user's account.

### Cash Transfer

- **Endpoint:** `/:id/cashtransffer`
- **Method:** PUT
- **Description:** Transfer cash or credit between users.

### Get Users by Active Status

- **Endpoint:** `/userstatus/:isactive`
- **Method:** GET
- **Description:** Retrieve users based on their active status.

### Delete User

- **Endpoint:** `/deleteuser/:id`
- **Method:** DELETE
- **Description:** Delete a user by their ID.

## Getting Started

1. go to : `https://bank-api-iscz.onrender.com/` and add endpoint as you wish!