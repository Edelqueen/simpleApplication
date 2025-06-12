
#!/bin/bash

echo "Deploying monitoring stack..."

# Create monitoring namespace and RBAC
kubectl apply -f monitoring/rbac.yaml

# Deploy Prometheus
kubectl apply -f monitoring/prometheus-config.yaml
kubectl apply -f monitoring/prometheus-deployment.yaml

# Deploy Node Exporter
kubectl apply -f monitoring/node-exporter.yaml

# Deploy Grafana
kubectl apply -f monitoring/grafana-deployment.yaml

echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n monitoring
kubectl wait --for=condition=available --timeout=300s deployment/grafana -n monitoring

echo "Getting access URLs..."
MINIKUBE_IP=$(minikube ip)
PROMETHEUS_PORT=$(kubectl get svc prometheus-service -n monitoring -o jsonpath='{.spec.ports[0].nodePort}')
GRAFANA_PORT=$(kubectl get svc grafana-service -n monitoring -o jsonpath='{.spec.ports[0].nodePort}')

echo ""
echo "=== Monitoring Stack Deployed Successfully ==="
echo ""
echo "Prometheus URL: http://$MINIKUBE_IP:$PROMETHEUS_PORT"
echo "Grafana URL: http://$MINIKUBE_IP:$GRAFANA_PORT"
echo ""
echo "Grafana Login:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "To check pod status:"
echo "kubectl get pods -n monitoring"
echo ""
