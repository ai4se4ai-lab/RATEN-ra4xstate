# Docker Setup for RATEN-ra4xstate

This project includes Docker support for building and running the RATEN package in a containerized environment.

## Prerequisites

- Docker Desktop (or Docker Engine) installed and running
- At least 2GB of free disk space

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs

# Stop container
docker-compose down
```

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t raten-xstate:latest .

# Run the container
docker run --rm raten-xstate:latest

# Run interactively
docker run -it --rm raten-xstate:latest sh

# Run tests
docker run --rm raten-xstate:latest yarn test
```

### Option 3: Using test scripts

**On Linux/Mac:**
```bash
chmod +x test-docker.sh
./test-docker.sh
```

**On Windows (PowerShell):**
```powershell
.\test-docker.ps1
```

## What the Dockerfile Does

1. **Build Stage:**
   - Installs Node.js 16 and Yarn
   - Installs all project dependencies
   - Builds the `core` package (XState)
   - Builds the `xstate-raten` package
   - Runs tests to verify the build

2. **Runtime Stage:**
   - Creates a minimal runtime image
   - Copies built artifacts
   - Verifies the package can be imported
   - Sets up the working directory

## Verifying the Build

The container automatically verifies:
- ✅ RATEN package is built correctly
- ✅ Package can be imported
- ✅ xstate dependency is available
- ✅ All exports are accessible

## Running Tests in Docker

```bash
# Run all tests
docker run --rm raten-xstate:latest yarn test

# Run tests with coverage
docker run --rm raten-xstate:latest yarn test --coverage

# Run specific test file
docker run --rm raten-xstate:latest yarn test preprocessing
```

## Development Mode

For development, you can mount the source directory:

```bash
docker run -it --rm \
  -v ${PWD}/packages/xstate-raten:/app/packages/xstate-raten \
  raten-xstate:latest sh
```

## Troubleshooting

### Docker Desktop not running
If you see an error about Docker Desktop, make sure:
- Docker Desktop is installed and running
- Docker daemon is accessible

### Build fails
- Check that you have enough disk space
- Try cleaning Docker cache: `docker system prune -a`
- Check network connectivity for npm/yarn

### Tests fail
- The Dockerfile includes error handling for test failures
- Check the test output in the container logs
- You can run tests manually inside the container

## Image Size

The final image is based on `node:16-alpine` which is lightweight (~40MB base + dependencies).

## Production Use

For production, consider:
- Using a multi-stage build (already implemented)
- Minimizing the final image size
- Setting appropriate resource limits
- Using specific version tags instead of `latest`

