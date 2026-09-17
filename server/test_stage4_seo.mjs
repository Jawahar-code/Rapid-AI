import { calculateContentAndSeoMetrics } from './utils/nlpEngine.js';

console.log('=== RAPID.AI 2.0 STAGE 4 SEO & CONTENT ANALYZER TESTS ===\n');

const testArticle = `
# Complete Guide to Kubernetes Microservices Architecture

In modern cloud computing, building resilient distributed systems requires scalable infrastructure. Microservices architecture enables engineering teams to deploy independent services rapidly without compromising system stability.

## Why Kubernetes for Microservices?

Kubernetes provides automated container orchestration, service discovery, and declarative configuration. By leveraging Kubernetes microservices, organizations achieve high availability, seamless blue-green deployments, and fine-grained resource utilization across hybrid cloud clusters.

### Core Architecture Components

A production-ready cluster comprises multiple essential layers:
1. Control plane nodes managing cluster state and etcd consensus.
2. Worker nodes running containerized workloads inside pods.
3. Ingress controllers routing external HTTP/HTTPS traffic reliably.

Deployments are executed using declarative YAML specifications. The pods are monitored continuously by health check probes, ensuring failed containers are replaced automatically.

### Best Practices for Optimization

To maintain low latency and prevent cascading failures:
- Implement distributed tracing and Prometheus metric scraping.
- Enforce strict resource limits and requests on every container.
- Establish automated horizontal pod autoscaling based on CPU and memory thresholds.
`;

// Test 1: Optimal keyword
console.log('--- TEST 1: Full Article with Focus Keyword ---');
const res1 = calculateContentAndSeoMetrics(testArticle, 'kubernetes microservices');
console.log('Stats:', res1.stats);
console.log('Readability:', res1.readability);
console.log('Lexical Diversity:', res1.lexicalDiversity + '%');
console.log('Passive Voice:', res1.passiveVoice);
console.log('Headings:', res1.headings);
console.log('Focus Keyword Analysis:', res1.focusKeywordAnalysis);
console.log('Scores:', res1.scores);
console.log('Top Keywords count:', res1.topKeywords.length);

console.log('\n--- TEST 2: Short Text without Keyword ---');
const shortText = 'Quick announcement: we have updated our server configurations today.';
const res2 = calculateContentAndSeoMetrics(shortText, '');
console.log('Short text scores:', res2.scores);
console.log('Short text readability reliability:', res2.readability.isReliable);
console.log('Short text keyword analysis:', res2.focusKeywordAnalysis);

console.log('\n=== ALL STAGE 4 TESTS COMPLETED SUCCESSFULLY ===');
