# Simple Application with SQLite3

This is a simple application that uses SQLite3 as the main database.

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT ENVIRONMENT                    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐                   │
│  │   WSL2   │    │  Docker  │    │   Replit     │                   │
│  │          │    │ Desktop  │    │     IDE      │                   │
│  └──────────┘    └──────────┘    └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          APPLICATION STACK                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐     ┌──────────────┐     ┌─────────────────┐     │
│  │   Frontend    │────▶│   Backend    │────▶│    Database     │     │
│  │               │     │              │     │                 │     │
│  │ HTML/CSS/JS   │     │  Node.js +   │     │   SQLite3 +     │     │
│  │               │     │  Express.js  │     │   Redis Cache   │     │
│  │ Port: 2019    │     │  Port: 2019  │     │                 │     │
│  └───────────────┘     └──────────────┘     └─────────────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         MONITORING STACK                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐     ┌──────────────┐     ┌─────────────────┐     │
│  │  Prometheus   │────▶│   Grafana    │     │ Node Exporter   │     │
│  │               │     │              │     │                 │     │
│  │ Metrics       │     │ Dashboards & │     │ System Metrics  │     │
│  │ Collection    │     │ Visualization│     │ (CPU/Memory)    │     │
│  │ Port: 30000   │     │ Port: 32000  │     │ Port: 9100      │     │
│  └───────────────┘     └──────────────┘     └─────────────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      KUBERNETES ORCHESTRATION                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐     ┌──────────────┐     ┌─────────────────┐     │
│  │   Minikube    │────▶│     Helm     │────▶│    Rancher      │     │
│  │               │     │              │     │                 │     │
│  │ Local K8s     │     │   Package    │     │  Cluster Mgmt   │     │
│  │ Cluster       │     │  Management  │     │  & Monitoring   │     │
│  └───────────────┘     └──────────────┘     └─────────────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        SECURITY & QUALITY                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐     ┌──────────────┐     ┌─────────────────┐     │
│  │    Trivy      │     │   GitHub     │     │     Jest        │     │
│  │               │     │  Actions     │     │                 │     │
│  │ Vulnerability │     │   CI/CD      │     │  Unit Testing   │     │
│  │   Scanner     │     │  Pipeline    │     │   Framework     │     │
│  └───────────────┘     └──────────────┘     └─────────────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          CLOUD DEPLOYMENT                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐     ┌──────────────┐     ┌─────────────────┐     │
│  │   AWS VPC     │────▶│   AWS EKS    │────▶│   AWS ECR       │     │
│  │               │     │              │     │                 │     │
│  │ Infrastructure│     │  Kubernetes  │     │ Container Image │     │
│  │ (Terraform)   │     │   Cluster    │     │   Registry      │     │
│  └───────────────┘     └──────────────┘     └─────────────────┘     │
│                                                                     │
│  ┌───────────────┐                                                  │
│  │ CodePipeline  │                                                  │
│  │               │                                                  │
│  │   CI/CD       │                                                  │
│  │  Automation   │                                                  │
│  └───────────────┘                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack Overview

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design with custom styling
- Real-time item management interface

**Backend:**
- Node.js runtime environment
- Express.js web framework
- RESTful API design
- Prometheus metrics integration

**Database:**
- SQLite3 for persistent data storage
- Redis for caching and session management
- Database health monitoring endpoints

**Containerization & Orchestration:**
- Docker for application containerization
- Kubernetes (Minikube) for local orchestration
- Helm charts for package management
- Rancher for cluster management

**Monitoring & Observability:**
- Prometheus for metrics collection
- Grafana for data visualization and dashboards
- Node Exporter for system metrics
- Custom application metrics

**DevOps & Security:**
- GitHub Actions for CI/CD automation
- Trivy for vulnerability scanning
- Jest for unit testing
- Docker image optimization

**Cloud Infrastructure:**
- AWS VPC for network isolation
- AWS EKS for managed Kubernetes
- AWS ECR for container registry
- AWS CodePipeline for deployment automation
- Terraform for infrastructure as code

### Data Flow

1. **User Request** → Frontend (HTML/CSS/JS)
2. **API Calls** → Backend (Express.js)
3. **Data Operations** → SQLite3 Database
4. **Caching** → Redis Cache
5. **Metrics Collection** → Prometheus
6. **Visualization** → Grafana Dashboards
7. **System Monitoring** → Node Exporter

---

## Setup

### Prerequisites

- Node.js
- Docker
- Minikube
- Kubernetes CLI (`kubectl`)
- Helm
- Rancher (for Kubernetes cluster management)
- Trivy

---

## Rancher Setup and Minikube Registration

### Rancher Setup in WSL

#### Prerequisites
- **WSL 2** installed on your Windows machine.
- **Docker Desktop** installed and configured to work with WSL 2.

#### Steps to Install Rancher
1. **Start Docker Desktop**:
   Ensure Docker Desktop is running and configured to use WSL 2.

2. **Access Rancher**:
   Open your browser and navigate to:

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

### Adding Trivy for Container Image Scanning

Trivy is a vulnerability scanner for container images, file systems, and Git repositories. It helps identify security issues in your application dependencies and container images.

#### Steps to Use Trivy

1. **Install Trivy**:
   Follow the installation instructions for your operating system from the [official Trivy documentation](https://aquasecurity.github.io/trivy/).

2. **Scan the Application's Docker Image**:
   After building the Docker image for the application, use Trivy to scan it:
   ```sh
   trivy image simple-application:sqlite
   ```

3. **Review the Scan Results**:
   Trivy will output a list of vulnerabilities, categorized by severity (e.g., CRITICAL, HIGH, MEDIUM, LOW). Address the critical and high-severity issues first.

4. **Automate Scanning**:
   Integrate Trivy into your CI/CD pipeline to ensure that container images are scanned automatically during the build process.

5. **Scan Local Files or Directories**:
   You can also scan your project directory for vulnerabilities:
   ```sh
   trivy fs .
   ```

6. **Keep Trivy Updated**:
   Regularly update Trivy to ensure it has the latest vulnerability database:
   ```sh
   trivy --update
   ```

By incorporating Trivy into your workflow, you can enhance the security of your application and container images.
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

### Monitoring with Prometheus and Grafana

This application includes a complete monitoring stack with Prometheus for metrics collection and Grafana for visualization.

#### Deploying the Monitoring Stack

1. **Deploy monitoring components**:
   ```sh
   chmod +x deploy-monitoring.sh
   ./deploy-monitoring.sh
   ```

2. **Verify monitoring deployment**:
   ```sh
   kubectl get pods -n monitoring
   kubectl get services -n monitoring
   ```

#### Accessing Monitoring Services

After deployment, you can access the monitoring services:

- **Prometheus**: `http://<MINIKUBE_IP>:30000`
  - Metrics collection and querying interface
  - View application and system metrics

- **Grafana**: `http://<MINIKUBE_IP>:32000`
  - Username: `admin`
  - Password: `admin123`
  - Pre-configured with Prometheus as data source

To get your Minikube IP:
```sh
minikube ip
```

#### Available Metrics

The application exposes metrics at `/metrics` endpoint including:
- HTTP request count
- Average request duration
- Application uptime
- Node.js version information

#### Monitoring Features

- **Application Metrics**: Custom metrics from your Node.js application
- **System Metrics**: CPU, memory, disk usage via Node Exporter
- **Kubernetes Metrics**: Pod and cluster metrics
- **Auto-discovery**: Prometheus automatically discovers pods with proper annotations

#### Creating Dashboards

1. Access Grafana at the URL shown after deployment
2. Login with admin credentials
3. Create new dashboards or import existing ones
4. Use PromQL queries to visualize metrics

Example PromQL queries:
- `http_requests_total` - Total HTTP requests
- `rate(http_requests_total[5m])` - Request rate per second
- `http_request_duration_ms` - Average response time

### Testing

1. Run the tests:
   ```sh
   npm test
   ```

### Summary

This updated `README.md` includes steps for setting up a Minikube cluster, deploying the application using Helm, scaling the application to multiple replicas, and monitoring with Prometheus and Grafana. It also provides instructions for testing and accessing the application and monitoring services.