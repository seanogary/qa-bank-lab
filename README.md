# QA Bank Lab [DRAFT - UNDER DEVELOPMENT]

## Table of Contents

[Description](#description)

[Project Structure](#project-structure)

[Testing Architecture](#testing-architecture)

[Video Demo](#video-demo)

[Takeaways](#takeaways)

[Current Development](#current-developments)

[Future Improvements](#future-improvements)

[How to Use](#how-to-use)

- [Installing](#installing)

- [How to Use](#how-to-use)

[License](#license)

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
│       └── integration/       # Integration tests - API+DB flows (backend end-to-end)
│           └── test_db.py
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
- **Integration Tests** (`integration/`): Test API + Database flows - full backend stack (API → Models → Database)

**Frontend Testing** (`frontend/qa-bank-lab/tests/`)
- **Playwright E2E Tests**: End-to-end browser testing covering full user workflows

## Video Demo

## Takeaways

I began this project with the intention of making a small object-oriented toy banking model to
gain experience defining and implementing semi-realistic business logic and practice writing unit 
and integration test in python with Pytest. This snowballed into the creation of a full-fledged
backend with fastAPI and SQLAlchemy. Once this was underway I decided to expand it to a full-stack 
project with React, using AI assitance (cursor) to accelerate front-end development but 
with enough knowledge of React (conceptually: components, props, hooks) to audit as needed. 

This expansion expansion turned the project into a full quality-assurance lab whose scope, behavior, 
and architecture I understand end-to-end, allowing me to practice thorough testing across the entire 
stack. 

Takeaway ideas (notes / draft):

- understanding testing boundaries: unit vs integration vs e2e (fuzzier than I thought)
- understanding debates: to mock or not to mock (I chose not to mock: why?)
- systems thinking (be more specific)
- designing databases: how to link policies to inidividuals, global ledger vs user specific ledger, etc (still artifacts in model that contradict approach in database!) 
- the benefit of transaction FIRST (I did not do this... see [future improvements](#future-improvements))



## Current Developments

- working on fixing frontend bugs
- finishing writing tests in playwright

## Future Improvements
- switch to a model in which transactions are generated, validated, and executed, in that order, rather than a model which treats transactions as a record of less transparent execution logic.

## How to Use

### Dependencies

### Installing

## License