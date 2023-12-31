# SG Technical Test

For notes and commends on this test
```
https://www.notion.so/Show-Piece-T-e098c60fd99947028844a5175f3c30f2?pvs=4
```
---

```bash
# Install packages
yarn
# Run dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
## Task
We have set up this partial simple invoice project for you to complete. 
Below is a list of tasks that we would like you to complete.

The tech stack is simple, using what we normally use on our projects, [NextJS](https://nextjs.org/docs) and [Chakra](https://chakra-ui.com/docs/components) for the UI.

You are free to add any other additional packages you require and can edit/refactor any of the existing code to complete any of the tasks.


- [ ] The `/api/invoices` is incomplete, please add the following:
  - [ ] Sort the api by invoice number
  - [ ] Add a discount of 10% to all invoices that are unpaid and are more than $100 in total (price on the invoice is in cents)
  - [ ] Make sure that if there are no results that an appropriate status code is sent back
  - [ ] Create a test for the API and test all cases

- [ ] Add an `Amount` column to table to display the total value of the invoice

- [ ] Calculate the totals for `Invoice Total`, `Total Paid` and `Total Owed`

- [ ] Add a feature that enables the user to delete invoices that have not been paid, user should get a prompt to confirm before deleting the item

- [ ] Format all dates `dd-mm-yyyy` 

- [ ] Currency is give in cents, format them as `$00.00`

- [ ] Highlight alternate rows

- [ ] Highlight table rows with unpaid invoices in red

- [ ] Fix the table with the totals to look like the one designed, floating to the right

- [ ] If there is a discount, display the discounted price in the table and highlight the amount in green.

- [ ] Add the `Discount` to the totals table at the bottom panel

- [ ] Mobile - fix the invoice # column to be sticky on the left side when table scrolls horizontally 

---
## Designs
![Screenshot](./public/designs/design-invice-list.png)
![Screenshot](./public/designs/design-invice-list-delete.png)
