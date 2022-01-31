<p align="center">
  <a href="https://github.com/nodejs" target="blank">
    <img src="https://nodejs.org/static/images/logo-light.svg" width="280" alt="Node.js Logo" />
  </a>
  <a href="https://github.com/nestjs" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
  <a href="https://github.com/postgres" target="blank">
    <img src="assets/elephant.png" height="135" width="135" alt="PostgreSQL Logo" />
  </a>
  <a href="https://github.com/typeorm/" target="blank">
    <img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" width="320" alt="TypeORM Logo" />
  </a>
  <a href="https://github.com/microsoft/TypeScript" target="blank">
    <img src="assets/typescript_logo.jpeg" height="135" width="135" alt="TypeScript Logo" />
  </a>
</p>

<br />
<hr />
<br />

## **Description**

An API to handle CRUD operations for a database record called a "Utility". Updating a Utility creates a "Version", which is a copy of the Utility as it was before it was updated. The API supports pagination, filtering, and sorting (in a limited sense).

This project was written in TypeScript on top of NodeJS with the Nest.JS framework, making use of TypeORM and PostgreSQL as additional tools.

<br />
<hr />
<br />

## **Installation**

```bash
$ npm install
```

<br />
<hr />
<br />

## **Running the API**

```bash
# set up the database
$ npm run db:build

# start up the server
$ npm run start
```

<br />
<hr />
<br />

## **API Functionality**

<br />

### **Routes**


| METHOD         |              ROUTES            | Returns |
| -------------- | ------------------------------ | ------- |
| GET            | /utility                       | list of all Utility records
|                | /utility?parameter=value       | list of all Utility records that match the query parameters (see below)
|                | /utility/**_{id}_**            | a singular Utility record with id = **_id_**
|                | /utility/**_{id}_**/versions   | list of all Version records tied to the Utility with **_id_**
|                | /versions                      | list of all Version records
| POST           | /utility                       | the newly created Utility record
| PUT            | /utility/**_{id}_**            | the updated Utility record with id = **_id_**
| DELETE         | /utility/**_{id}_**            | status code 200 OK

#### **Route Request Body Requirements**

**POST / PUT**
Available Properties:
- title
- description
- published

```javascript
{
  // property: value
  "title": "legs",
  "description": "an essential part of any bipedal organism"
}
```

### **Query Parameters**

All query parameters below can be mixed and matched as needed.

Example: 
- /utility?sort=version:asc&filter=description:turtle&page=4&results_per_page=1

#### **Sorting**
- Sorting has been restricted to a sorting by single column, for now
- Available fields to sort by:
  - title
  - created_at
  - updated_at
  - version
  - published
- Available directions to sort:
  - asc
  - desc
- Examples: 
  - /utility?sort=title:asc
  - /utility?sort=published:desc

#### **Filtering**
- Filtering has been restricted to filtering by one field, for now
- Available fields to sort by:
  - title
  - description
  - published
  - version
- Examples:
  - /utility?filter=title:raven
  - /utility?filter=description:really

#### **Pagination**
<p> 
Pagination has implicit support on all API routes that can return multiple records. Any route may have a query parameter appended (?page=2) in order to show another page
</p>

Pagination options:
- page
- results_per_page (Utility only)

Examples:
- /versions?page=3
- /utility?results_per_page=2&

<p> The pagination in a typical response looks like this: </p>

```json
// /utility/1/versions?page=2
{
  "content": { /* data returned here */ },
  "page": 2,
  "results_per_page": 5,
  "total_results": 6
}
```

<br />
<hr />
<br />

## Licenses

  Read NodeJS's License section [here](https://github.com/nodejs/node#license)

  Read NestJS's License section [here](https://github.com/nestjs/nest#license)
  
  Read PostgreSQL's License [here](https://github.com/postgres/postgres/blob/master/COPYRIGHT)
  
  Read TypeORM's License [here](https://github.com/typeorm/typeorm/blob/master/LICENSE)
  
  Read TypeScript's License [here](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt)
