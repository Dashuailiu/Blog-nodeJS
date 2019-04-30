# Project structure

```bash
.
|--controllers				##
|--models							## 
|--node_modules       ## 3rd-party packages
|--public							## Public static resources
|--views							## All html views
|--routes							##
|--README.md					## Project description
|--app.js							## Entry file
|--package.json
|--package-lock.json
```



# Route Table

| path      | method | params                    | login | remarks                   |
| --------- | ------ | ------------------------- | ----- | ------------------------- |
| /         | GET    |                           |       | Homepage                  |
| /register | GET    |                           |       | Page for registration     |
| /register | POST   | email, nickname, password |       | Requests for registration |
| /login    | GET    |                           |       | Page for login            |
| /login    | POST   | email, password           |       | Requests for login        |
| /logout   | GET    |                           | x     | Requests for logout       |

| path              | method | params                  | login | remarks                    |
| ----------------- | ------ | ----------------------- | ----- | -------------------------- |
| /topics/new       | GET    |                         | x     | Page for new topic publish |
| /topics/new       | POST   | section, title, content | x     | Action for new topic       |
| /topics/:topic_id | GET    |                         | x     | Action for topic details   |

