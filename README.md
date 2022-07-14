# Bank App

## What is it?

A banking app that shows recent transactions, allows transfers to another user, request loans and delete your user account.
The site does not use local storage or a backend DB, so nothing is saved permanently

## How does it work?

### Log in

Log in using username: ih, and pin: 1111  
Alternative user: jd, pin: 2222

### Transfers

You can transfer to another account by typing the username and the amount you want to transfer.  
You must have enough to conduct the transfer, and the recipient must be a valid account.

### Loans

Request a loan by entering the amount you would like.  
You must have a _single_ deposit at least 10 times greater than the loan amount to get approved.  
e.g. Cannot get £100 loan without a single £1000 deposit.

### Close your account

Close your account by entering your username and pin number.  
You will be logged out immediately and will not be able to log in until the page is refreshed.

### Additional functionality

Toggle between chronological and descending transaction value by clicking the sort button

Inactivity timer that will Log out the user if no activity is detected in 5 mins

Localisation of accounts using the Intl API.  
User jd uses the american format for dates and USD for transactions.  
User ih uses UK format and GBP for transactions.
