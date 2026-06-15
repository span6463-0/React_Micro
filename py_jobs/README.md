# py-jobs

Python project managed with [uv](https://docs.astral.sh/uv/) — a fast Rust-based Python package and project manager.

---

## Requirements

- [uv](https://docs.astral.sh/uv/) installed globally

```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Getting Started

```bash
# Clone and install all dependencies from uv.lock
git clone <repo-url>
cd py-jobs
uv sync
```

---

## uv — Essential Commands

### Project Setup

```bash
# Create a new project
uv init my-project --python 3.12

# Create a library (publishable package)
uv init my-lib --lib

# Pin Python version for the project
uv python pin 3.12
```

### Virtual Environment

```bash
# Create a virtual environment (uv init does this automatically)
uv venv

# Create with a specific Python version
uv venv --python 3.11

# Activate manually (only needed if not using uv run)
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

### Managing Dependencies

```bash
# Add a dependency
uv add requests

# Add multiple packages
uv add fastapi uvicorn

# Add with version constraint
uv add "django>=4.2,<5.0"

# Add a dev dependency
uv add --dev pytest ruff black

# Add to a named group
uv add --group test pytest-cov

# Remove a dependency
uv remove requests

# Upgrade a specific package
uv add requests --upgrade

# Upgrade all packages
uv lock --upgrade
```

### Installing Dependencies

```bash
# Install all deps from pyproject.toml
uv sync

# Include dev dependencies
uv sync --dev

# Exact install from lockfile (use in CI/prod)
uv sync --frozen

# Install a specific group only
uv sync --group test
```

### Running Code

```bash
# Run a script inside the venv (no activation needed)
uv run python main.py

# Run a module
uv run python -m pytest

# Run a tool installed in the venv
uv run ruff check .
uv run ruff check . --fix

# Run a one-off tool without installing it (like npx)
uvx ruff check .
uvx black .
uvx pytest
```

### Lock File

```bash
# Generate / update uv.lock
uv lock

# Verify lockfile is up to date (for CI)
uv lock --check
```

### Python Version Management

```bash
# List available Python versions
uv python list

# Install a specific Python version
uv python install 3.12

# Show currently pinned version
cat .python-version
```

### pip Compatibility

```bash
# Use uv as a faster drop-in for pip
uv pip install requests
uv pip install -r requirements.txt
uv pip freeze
uv pip list
uv pip uninstall requests
```

---

## Running Tests

```bash
uv run python -m pytest
uv run python -m pytest -v
uv run python -m pytest test/
```

---

## Project Structure

```
py-jobs/
├── .venv/              # Virtual environment (gitignored)
├── .python-version     # Pinned Python version
├── pyproject.toml      # Project config + dependencies
├── uv.lock             # Locked dependency versions (commit this)
├── main.py             # Entry point
├── src/                # Application source code
└── test/               # Tests
```

---

## Key Files

| File              | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `pyproject.toml`  | Project metadata and dependency declarations    |
| `uv.lock`         | Exact locked versions — always commit this      |
| `.python-version` | Pinned Python version for this project          |
| `.venv/`          | Local virtual environment — add to `.gitignore` |
