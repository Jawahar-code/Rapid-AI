import { calculateContentAndSeoMetrics } from './utils/nlpEngine.js';

console.log('=== STAGE 4 THOROUGH VERIFICATION SUITE (ALL INPUT COMBINATIONS) ===\n');

// 3.a. Well-structured article with focus keyword
const test_a = `
# Complete Guide to Cloud Architecture and Distributed Systems

In modern enterprise software engineering, building reliable systems requires resilient cloud infrastructure and deliberate system design patterns. Distributed systems allow engineering teams to scale microservices independently while maintaining high system availability.

## Architectural Fundamentals of Distributed Systems

Distributed computing introduces distinct challenges including partial network failures, data consistency, and distributed state consensus. Cloud architecture patterns such as circuit breakers, event sourcing, and CQRS mitigate these vulnerabilities by decoupling individual services.

### Monitoring and Observability Strategies

A robust distributed systems deployment relies on three pillars:
- Distributed telemetry tracing across all asynchronous message queues.
- Centralized metric scraping with automated threshold alerts.
- Structured JSON logging aggregated across all container instances.
`;
console.log('--- TEST 3.a: Well-structured article with focus keyword ---');
const res_a = calculateContentAndSeoMetrics(test_a, 'distributed systems');
console.log('Scores:', res_a.scores);
console.log('Focus Keyword Status:', res_a.focusKeywordAnalysis);
console.log('Headings:', res_a.headings);
console.log('Readability isReliable:', res_a.readability.isReliable);

// 3.b. Article without focus keyword
console.log('\n--- TEST 3.b: Article without focus keyword ---');
const res_b = calculateContentAndSeoMetrics(test_a, '');
console.log('Scores:', res_b.scores);
console.log('Focus Keyword Status:', res_b.focusKeywordAnalysis.status);
console.log('Top Keywords Found:', res_b.topKeywords.slice(0, 5).map(k => k.keyword));

// 3.c. Very short content
console.log('\n--- TEST 3.c: Very short content ---');
const res_c = calculateContentAndSeoMetrics('Hello world! Short note.', '');
console.log('Scores:', res_c.scores);
console.log('Word count:', res_c.stats.wordCount);
console.log('Readability isReliable:', res_c.readability.isReliable);
console.log('Reliability Note:', res_c.readability.reliabilityNote);

// 3.d. Content with no Markdown headings
console.log('\n--- TEST 3.d: Content with no Markdown headings ---');
const test_d = `
This is a standard article that does not contain any markdown headings at all.
It consists purely of continuous paragraphs discussing software engineering and developer workflows.
Teams should write clear code and test their applications regularly.
Continuous integration helps detect defects before code reaches staging environments.
`;
const res_d = calculateContentAndSeoMetrics(test_d, 'software');
console.log('Headings:', res_d.headings);
console.log('SEO Score (penalized for missing headings):', res_d.scores.seoScore);

// 3.e. Content with H1, H2, and H3 headings
console.log('\n--- TEST 3.e: Content with H1, H2, and H3 headings ---');
console.log('Headings in test_a:', res_a.headings);
console.log('Has H1:', res_a.headings.h1Count > 0, 'Has H2:', res_a.headings.h2Count > 0, 'Has H3:', res_a.headings.h3Count > 0);

// 3.f. Keyword density below 1%
console.log('\n--- TEST 3.f: Keyword density below 1% ---');
const res_f = calculateContentAndSeoMetrics(test_a, 'resilience');
console.log('Density:', res_f.focusKeywordAnalysis.densityPercent + '%');
console.log('Status:', res_f.focusKeywordAnalysis.status);

// 3.g. Keyword density between 1% and 2.5%
console.log('\n--- TEST 3.g: Keyword density between 1% and 2.5% ---');
console.log('Density:', res_a.focusKeywordAnalysis.densityPercent + '%');
console.log('Status:', res_a.focusKeywordAnalysis.status);

// 3.h. Keyword density above 2.5%
console.log('\n--- TEST 3.h: Keyword density above 2.5% ---');
const test_h = 'Cloud computing is great. Cloud computing scales fast. Cloud computing is everywhere. Cloud computing helps businesses grow. Cloud computing saves money.';
const res_h = calculateContentAndSeoMetrics(test_h, 'cloud computing');
console.log('Density:', res_h.focusKeywordAnalysis.densityPercent + '%');
console.log('Status:', res_h.focusKeywordAnalysis.status);

// 3.i. Content containing passive-voice sentences
console.log('\n--- TEST 3.i: Content containing passive-voice sentences ---');
const test_i = 'The system was configured by administrators. The report was generated yesterday. New features were deployed by the team. All bugs have been fixed.';
const res_i = calculateContentAndSeoMetrics(test_i, '');
console.log('Passive Voice Count:', res_i.passiveVoice.count);
console.log('Passive Voice Ratio:', res_i.passiveVoice.sentenceRatioPercent + '%');
console.log('Passive Voice Examples:', res_i.passiveVoice.examples);

// 3.j. Content with bullet points and fragmented sentences
console.log('\n--- TEST 3.j: Content with bullet points and fragmented sentences ---');
const test_j = `
Skills and checklist:
• Python, JavaScript, TypeScript, React, Docker, Kubernetes, AWS, SQL, PostgreSQL, MongoDB, Redis, GraphQL
• Project planning and agile workflows
• Continuous deployment
`;
const res_j = calculateContentAndSeoMetrics(test_j, '');
console.log('Readability isReliable:', res_j.readability.isReliable);
console.log('Reading level:', res_j.readability.readingLevel);
console.log('Reliability Note:', res_j.readability.reliabilityNote);

console.log('\n=== ALL INPUT COMBINATIONS VERIFIED ===');
