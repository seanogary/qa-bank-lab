# QA Bank Lab [DRAFT - UNDER DEVELOPMENT]

This project is meant to demonstrate knowledge of testing with pytest and playwright. In addition, it demonstrates knowledge of full-stack development in React and Python, Rest API design, and
the ability to design solutions to realistic business problems with software. 

## Description

QA Bank Lab is a full-stack toy banking application. It supports account creation, simple
transactions within and between accounts, as well as administrator accounts and dashboards. This
serves as a useful "lab" in which to learn and practice QA / Testing.

## Project Structure

```
qa-bank-lab/
├── backend/
│   ├── models.py              # Business logic (Account, Transaction, Policy)
│   ├── db.py                  # Database layer (CRUD operations)
│   ├── main.py                # FastAPI application
│   └── tests/
│       ├── unit/              # Unit tests - business logic validation
│       │   ├── test_models.py
│       │   └── transaction_factory.py
│       ├── integration/       # Integration tests - DB layer & API+DB
│       │   └── test_db.py
│       └── e2e/               # End-to-end tests (backend API flows)
│
├── frontend/
│   └── qa-bank-lab/
│       ├── src/               # React application
│       └── tests/             # Playwright E2E tests (frontend + backend)
│           ├── fixtures/
│           └── utils/
│
└── README.md
```

### Testing Architecture

**Backend Testing** (`backend/tests/`)
- **Unit Tests** (`unit/`): Test business logic in isolation (models, policies, validation)
- **Integration Tests** (`integration/`): Test database layer with real SQLite database
- **E2E Tests** (`e2e/`): Test complete API workflows

**Frontend Testing** (`frontend/qa-bank-lab/tests/`)
- **Playwright Tests**: End-to-end browser testing covering full user workflows
- Tests frontend React components integrated with backend API

## Video Demonstration

## How to Run Project

### Dependencies

* Describe any prerequisites, libraries, OS version, etc., needed before installing program.
* ex. Windows 10

### Installing

* How/where to download your program
* Any modifications needed to be made to files/folders

### Executing program

* How to run the program
* Step-by-step bullets
```
code blocks for commands
```

## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)