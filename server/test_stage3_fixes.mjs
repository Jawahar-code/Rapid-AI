import {
  detectDocumentStructure,
  calculateReadability,
  calculateBasicStats,
  extractKeywords
} from 'file:///J:/Projects/Rapid.ai%202.0/server/utils/nlpEngine.js';

// =========================================================================
// TEST CORPUSES
// =========================================================================

// 1. Genuine Research Paper
const researchPaperSample = `
Attention Is All You Need
arXiv:1706.03762v5 [cs.CL]

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.

1. Introduction
Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling. The Transformer is the first transduction model relying entirely on self-attention.

2. Related Work
The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S. In these models, the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions.

3. Methodology
The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder. Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.

4. Experiments and Results
On the WMT 2014 English-to-German translation task, the big transformer model outperforms the best previously reported models by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4. On the English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score.

5. Conclusion
In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention.

References
Vaswani et al., Attention is all you need, Advances in Neural Information Processing Systems, 2017.
`;

// 2. Normal Prose Document
const normalProseSample = `
The Evolution of Digital Workplaces in the Modern Era

Over the past decade, the nature of corporate work has transformed drastically due to ubiquitous cloud connectivity. Organizations across the globe are adopting remote and asynchronous communication models to increase employee satisfaction and operational efficiency.

While flexibility offers substantial benefits, it also introduces challenges regarding collaboration and digital fatigue. Leaders must intentionally design digital workflows that prioritize deep focus, clear documentation, and transparent objective tracking. When executed thoughtfully, digital workplaces bridge geographic divides without sacrificing cultural cohesion.

Modern productivity tools enable teams to collaborate across time zones with unprecedented ease. Cloud storage, shared document editing, and real-time chat platforms allow employees to contribute on their own schedules. Consequently, organizations can recruit talented professionals from anywhere in the world, fostering diverse and resilient teams.

However, remote environments require stronger emphasis on asynchronous communication and rigorous documentation habits. Without casual office interactions, ambiguous guidelines quickly compound into costly misalignments. Forward-thinking companies invest heavily in internal wikis, structured knowledge bases, and transparent goal frameworks. By formalizing institutional knowledge, teams maintain velocity while avoiding unnecessary meetings.
`;

// 3. User's Resume / Resume-like Document
const resumeSample = `
Alex Morgan
Senior Full Stack & AI Software Engineer | San Francisco, CA
alex.morgan@email.com | github.com/alexmorgan | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 7+ years of experience designing high-throughput distributed microservices and LLM-powered applications using React, Node.js, Python, PostgreSQL, and AWS.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, Go
Frontend: React, Next.js, Redux, Tailwind CSS, HTML5, CSS3
Backend: Node.js, Express, FastAPI, Django, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis, Pinecone
Cloud & DevOps: Docker, Kubernetes, AWS (ECS, Lambda, S3), CI/CD, Git

PROFESSIONAL EXPERIENCE
Senior Software Engineer | TechNova Solutions | 2022 - Present
• Designed and developed an enterprise LLM analytics platform processing 10M+ daily events using React and Node.js.
• Created a vector-search recommendation pipeline with Pinecone and FastAPI, improving discovery rate by 34%.
• Optimized PostgreSQL query performance, reducing p95 database latency by 45%.
• Adopted agile methodology across a 12-person cross-functional engineering team.
• Led architectural migration from monolithic backend to Dockerized microservices.

Software Engineer | CloudSphere Inc. | 2019 - 2022
• Engineered scalable REST APIs using Express.js and TypeScript serving 500k monthly active users.
• Built interactive data visualization dashboards using React, D3.js, and Tailwind CSS.
• Implemented OAuth2 and role-based access control authentication workflows.
• Reduced CI/CD pipeline build times by 40% via multi-stage Docker builds and caching.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2015 - 2019
`;

// 4. Bullet-Heavy Technical Document
const bulletHeavySample = `
System Deployment and Infrastructure Checklist

Please complete the following technical tasks prior to the production release:
• Verify Kubernetes cluster configuration across all worker nodes.
• Confirm all environment secrets and API keys are stored in AWS Secrets Manager.
• Execute database migrations and verify foreign key constraints on the users table.
• Run automated end-to-end integration test suites across staging microservices.
• Inspect SSL/TLS certificate expiration dates and auto-renewal cron schedules.
• Review CloudWatch alarms, metric alerts, and PagerDuty notification channels.
• Ensure redis cache replication topology is healthy and cluster failover is enabled.
• Validate load balancer health check endpoints and response status codes.
`;

// 5. Very Short Document
const veryShortSample = `
Hello world. Quick note.
`;

// =========================================================================
// TEST EXECUTION
// =========================================================================

const tests = [
  { name: '1. Genuine Research Paper', text: researchPaperSample },
  { name: '2. Normal Prose Document', text: normalProseSample },
  { name: '3. Resume Document', text: resumeSample },
  { name: '4. Bullet-Heavy Technical Document', text: bulletHeavySample },
  { name: '5. Very Short Document', text: veryShortSample }
];

console.log('===============================================================');
console.log('STAGE 3 COMPREHENSIVE VERIFICATION SUITE');
console.log('===============================================================\n');

for (const t of tests) {
  console.log(`---------------------------------------------------------------`);
  console.log(`TEST: ${t.name}`);
  console.log(`---------------------------------------------------------------`);

  const structure = detectDocumentStructure(t.text);
  const readability = calculateReadability(t.text);
  const stats = calculateBasicStats(t.text);

  console.log(`Document Type:       ${structure.documentType}`);
  console.log(`Confidence:          ${structure.confidence}%`);
  console.log(`Detected Sections:   ${structure.detectedSections.join(', ') || 'None'}`);
  console.log(`Paper Markers:       ${structure.paperSpecificMarkers.join(', ') || 'None'}`);
  console.log(`Word Count:          ${stats.wordCount}`);
  console.log(`Sentence Count:      ${stats.sentenceCount}`);
  console.log(`Avg Sentence Length: ${stats.avgSentenceLength} words`);
  console.log(`Flesch Reading Ease: ${readability.fleschReadingEase}`);
  console.log(`FK Grade Level:      ${readability.fleschKincaidGrade}`);
  console.log(`Reading Level:       ${readability.readingLevel}`);
  console.log(`isReliable:          ${readability.isReliable}`);
  console.log(`reliabilityNote:     ${readability.reliabilityNote || 'N/A'}`);
  console.log('\n');
}
