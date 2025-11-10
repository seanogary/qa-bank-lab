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

## Future Improvements

## How to Use

### Dependencies

### Installing

## License