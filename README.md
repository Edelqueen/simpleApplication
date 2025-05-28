# Simple Application with SQLite3

This is a simple application that uses SQLite3 as the main database.

## Setup

### Prerequisites

- Node.js
- Docker
- Minikube
- Kubernetes CLI (`kubectl`)
- Helm

### Installation

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd simpleApplication
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Copy the `.env.example` file to `.env` and update the values as needed:
   ```sh
   cp .env.example .env
   ```

4. Start the application locally:
   ```sh
   npm start
   ```

### Minikube Cluster Setup

1. Start Minikube:
   ```sh
   minikube start
   ```

2. Configure your shell to use Minikube's Docker daemon:
   ```sh
   eval $(minikube docker-env)
   ```

3. Build the Docker image for the application:
   ```sh
   docker build -t simple-application:sqlite .
   ```

4. Verify the image exists in Minikube's Docker environment:
   ```sh
   docker images
   ```

5. Deploy the application using Helm:
   ```sh
   helm install my-app ./simple-app
   ```

6. Verify the deployment:
   ```sh
   kubectl get pods
   kubectl get services
   ```

7. Access the application:
   ```sh
   minikube service my-app-simple-app
   ```

### Scaling the Application

1. Update the replica count in the Helm chart:
   Open `simple-app/values.yaml` and set `replicaCount` to the desired number of replicas:
   ```yaml
   replicaCount: 3
   ```

2. Apply the updated Helm chart:
   ```sh
   helm upgrade my-app ./simple-app
   ```

3. Verify the scaled deployment:
   ```sh
   kubectl get pods
   ```

4. Test the application:
   Access the service URL provided by Minikube and verify that the application is running across multiple replicas.

### Environment Variables

- `PORT`: The port on which the application will run (default: 2019)
- `SQLITE_DB_PATH`: The path to the SQLite database file (default: `data/items.db`)

### API Endpoints

#### Items API

- `GET /items`: Get all items
- `GET /items/:id`: Get an item by ID
- `POST /items`: Create a new item
- `PUT /items/:id`: Update an item
- `DELETE /items/:id`: Delete an item

#### Database Health Check

- `GET /health`: Check if the application is running
- `GET /db/health`: Check if the SQLite database is connected
- `GET /db/test`: Test database operations

### Testing

1. Run the tests:
   ```sh
   npm test
   ```



### Summary

This updated `README.md` includes steps for setting up a Minikube cluster, deploying the application using Helm, and scaling the application to multiple replicas. It also provides instructions for testing and accessing the application.