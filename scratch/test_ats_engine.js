/**
 * Comprehensive Automated Test Suite for Resuma AI ATS Diagnostic Engine
 * Tests both client-side deterministic rules and backend Gemini AI semantic audit
 */

import { runResumeAudit, stripHtml, extractBullets } from '../frontend/src/utils/resumeAuditEngine.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runAllTests() {
  console.log('\n=================================================================');
  console.log('🚀 RUNNING RESUMA AI ATS DIAGNOSTIC ENGINE COMPREHENSIVE TESTS');
  console.log('=================================================================\n');

  // -----------------------------------------------------------------
  // SUITE 1: Helper Functions (stripHtml & extractBullets)
  // -----------------------------------------------------------------
  console.log('📌 Test Suite 1: Text Sanitization & Bullet Extraction');
  {
    const html = '<p>• Spearheaded <b>$2.5M</b> migration.<br>• Managed 12 engineers.</p>';
    const stripped = stripHtml(html);
    assert(stripped.includes('$2.5M migration') && !stripped.includes('<p>'), 'stripHtml correctly removes HTML tags');

    const bullets = extractBullets(html);
    assert(bullets.length === 2, `extractBullets extracts 2 bullets (got ${bullets.length})`);
    assert(bullets[0].includes('$2.5M'), 'First bullet contains metric');
  }

  // -----------------------------------------------------------------
  // SUITE 2: Executive-Grade Resume (Target: 85+ / Executive Ready)
  // -----------------------------------------------------------------
  console.log('\n📌 Test Suite 2: Executive-Grade Resume Quality Evaluation');
  {
    const executiveResume = {
      title: 'Alex_Morgan_Lead_Solutions_Architect_Resume',
      basics: {
        name: 'Alex Morgan',
        headline: 'Lead Solutions Architect & Cloud Engineering Director',
        email: 'alex.morgan@executivemail.com',
        phone: '+1 (555) 342-9871',
        location: 'San Francisco, CA',
        url: { label: 'linkedin.com/in/alexmorgan', href: 'https://linkedin.com/in/alexmorgan' }
      },
      sections: {
        summary: {
          content: '<p>Distinguished technical leader with over 10 years of experience architecting enterprise cloud solutions. Proven record of reducing infrastructure overhead by 40% and accelerating product velocity across distributed engineering teams.</p>',
          visible: true
        },
        skills: {
          items: [
            { name: 'Kubernetes', keywords: ['EKS', 'K8s'] },
            { name: 'Go', keywords: ['Golang'] },
            { name: 'AWS Cloud', keywords: ['Terraform'] },
            { name: 'Distributed Systems', keywords: ['Kafka'] },
            { name: 'Microservices', keywords: ['gRPC'] },
            { name: 'System Architecture', keywords: ['Scalability'] },
          ],
          visible: true
        },
        experience: {
          items: [
            {
              company: 'Apex Cloud Systems',
              position: 'Lead Solutions Architect',
              date: '2021 – Present',
              summary: '<p>• Architected high-throughput distributed microservices in Go and Kubernetes, scaling platform capacity to 2.5M daily active users.<br>• Spearheaded a comprehensive multi-cloud migration to AWS, reducing annual hosting expenditures by $450K (38%).<br>• Mentored 14 senior engineers, establishing rigorous CI/CD standards that slashed deployment cycle times by 45%.</p>',
              visible: true
            },
            {
              company: 'Vanguard Networks',
              position: 'Senior Systems Engineer',
              date: '2017 – 2021',
              summary: '<p>• Engineered real-time event streaming pipeline using Kafka and Go, processing 50K events/second with sub-15ms latency.<br>• Orchestrated zero-downtime database cutovers across 12 production clusters, maintaining 99.99% uptime SLA.</p>',
              visible: true
            }
          ],
          visible: true
        },
        education: {
          items: [
            {
              institution: 'Stanford University',
              studyType: 'B.S.',
              area: 'Computer Science',
              date: '2013 – 2017',
              visible: true
            }
          ],
          visible: true
        }
      }
    };

    const audit = runResumeAudit(executiveResume);
    assert(audit.overallScore >= 85, `Executive resume scores high (Got ${audit.overallScore}/100)`);
    assert(audit.grade === 'Executive Ready', `Grade is 'Executive Ready' (Got: ${audit.grade})`);
    assert(audit.gradeColor === 'emerald', `Grade color is emerald (Got: ${audit.gradeColor})`);

    // Check individual pillar scores
    const contentPillar = audit.pillars.find(p => p.key === 'content');
    assert(contentPillar.score >= 90, `Content pillar scores >= 90% (Got ${contentPillar.score}%)`);

    const polishPillar = audit.pillars.find(p => p.key === 'polish');
    assert(polishPillar.score === 100, `Polish pillar has zero pronoun/buzzword violations (Got ${polishPillar.score}%)`);

    const careerPillar = audit.pillars.find(p => p.key === 'career');
    assert(careerPillar.score >= 80, `Career pillar recognizes substantiated skills & leadership verbs (Got ${careerPillar.score}%)`);
  }

  // -----------------------------------------------------------------
  // SUITE 3: Flawed / Entry Resume (Targeting Issue Detection)
  // -----------------------------------------------------------------
  console.log('\n📌 Test Suite 3: Flawed Resume Diagnostic Catch Rate');
  {
    const flawedResume = {
      title: 'resume_draft_v1',
      basics: {
        name: 'J', // Too short
        headline: '', // Missing
        email: 'cool_gamer_1982739487@yahoo.com', // Unprofessional digits
        phone: '123', // Incomplete
        location: '', // Missing
      },
      sections: {
        summary: {
          content: '<p>I am a hardworking team player and self-starter who loves coding and thinking outside the box.</p>',
          visible: true
        },
        skills: {
          items: [
            { name: 'Python' },
            { name: 'Machine Learning' }
          ],
          visible: true
        },
        experience: {
          items: [
            {
              company: 'Startup',
              position: 'Junior Dev',
              date: '03/2021', // Mixed format with later 2022
              summary: '<p>• Responsible for helping with the website bug fixes.<br>• Managed daily backlog tasks.<br>• Managed testing tickets.<br>• Managed user feedback forms.<br>• Assisted in writing simple scripts.</p>',
              visible: true
            }
          ],
          visible: true
        },
        education: {
          items: [], // Missing education items
          visible: true
        }
      }
    };

    const audit = runResumeAudit(flawedResume);
    console.log(`   Audited Score: ${audit.overallScore}/100, Total Issues: ${audit.totalIssues}`);

    assert(audit.overallScore <= 65, `Flawed resume receives appropriate low score (Got ${audit.overallScore})`);
    assert(audit.totalIssues >= 8, `Engine detects at least 8 specific issues (Got ${audit.totalIssues})`);

    // 1. Check Quantifying Impact
    const quantCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'quantifying_impact');
    assert(quantCheck.status === 'issue', 'Quantifying Impact correctly flagged as issue');

    // 2. Check Action Verbs (passive phrasing)
    const verbCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'action_verbs');
    assert(verbCheck.findings.some(f => f.text.toLowerCase().includes('responsible for')), 'Detected "responsible for" passive opener');

    // 3. Check Repetition (Managed 3x)
    const repCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'word_repetition');
    assert(repCheck.findings.some(f => f.text.includes('"managed" is used 3 times')), 'Detected repetition of "Managed" 3 times');

    // 4. Check First-Person Pronouns ("I am")
    const pronounCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'pronoun_audit');
    assert(pronounCheck.status === 'issue', 'First-person pronoun audit correctly flagged as issue');

    // 5. Check Buzzwords ("team player", "self-starter", "think outside the box")
    const buzzCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'buzzword_detection');
    assert(buzzCheck.findings.length >= 2, `Detected multiple buzzwords (Found ${buzzCheck.findings.length})`);

    // 6. Check Essential Sections (Education empty)
    const essentialCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'essential_sections');
    assert(essentialCheck.findings.some(f => f.text.includes('Education')), 'Flagged missing Education section');

    // 7. Check Skill Substantiation (Python & Machine Learning never mentioned in bullets)
    const skillCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'skill_substantiation');
    assert(skillCheck.findings.some(f => f.text.includes('Python')), 'Flagged unsubstantiated skill Python');
  }

  // -----------------------------------------------------------------
  // SUITE 4: Bullet Rewrite & Section Navigation Contract
  // -----------------------------------------------------------------
  console.log('\n📌 Test Suite 4: 1-Click Action & Navigation Targets');
  {
    const sampleResume = {
      basics: { name: 'Taylor' },
      sections: {
        experience: {
          items: [
            {
              company: 'TechCorp',
              position: 'Engineer',
              summary: '<p>• Worked on frontend features and helped with releases.</p>'
            }
          ]
        }
      }
    };

    const audit = runResumeAudit(sampleResume);
    const verbCheck = audit.pillars.flatMap(p => p.checks).find(c => c.id === 'action_verbs');
    assert(verbCheck.sectionKey === 'experience', 'Check points to valid editor sectionKey "experience"');

    // Test replacement simulation
    const original = 'Worked on frontend features and helped with releases.';
    const improved = 'Architected responsive frontend components, accelerating release velocity by 30%.';
    let summaryHtml = sampleResume.sections.experience.items[0].summary;

    assert(summaryHtml.includes(original), 'Original bullet is present before rewrite');
    summaryHtml = summaryHtml.replace(original, improved);
    assert(summaryHtml.includes(improved) && !summaryHtml.includes(original), 'Replacement succeeds cleanly within HTML tags');
  }

  // -----------------------------------------------------------------
  // SUITE 5: Defensive Resilience (Edge Cases & Nulls)
  // -----------------------------------------------------------------
  console.log('\n📌 Test Suite 5: Null Safety & Edge Case Resilience');
  {
    const emptyAudit = runResumeAudit({});
    assert(!isNaN(emptyAudit.overallScore), 'Empty object returns non-NaN score');
    assert(emptyAudit.overallScore >= 0 && emptyAudit.overallScore <= 100, 'Score is bounded between 0 and 100');
    assert(emptyAudit.pillars.length === 6, 'All 6 pillars are initialized');

    const nullAudit = runResumeAudit({
      basics: null,
      sections: {
        experience: { items: [null, {}] },
        skills: { items: [null] }
      }
    });
    assert(!isNaN(nullAudit.overallScore), 'Null-laden payload handled safely without exceptions');
  }

  // -----------------------------------------------------------------
  // SUITE 6: Live Backend Gemini AI Audit Integration Test
  // -----------------------------------------------------------------
  console.log('\n📌 Test Suite 6: Live Backend Gemini AI API Endpoint (/api/gemini/resume-audit)');
  try {
    const testResumePayload = {
      resumeData: {
        basics: {
          name: 'Sarah Chen',
          headline: 'Full Stack Software Engineer',
          email: 'sarah.chen@example.com',
          location: 'Seattle, WA',
          summary: 'Full stack engineer with experience building web applications with React and Node.js.'
        },
        sections: {
          skills: {
            items: [{ name: 'React' }, { name: 'Node.js' }, { name: 'MongoDB' }]
          },
          experience: {
            items: [
              {
                company: 'CloudWave Tech',
                position: 'Software Developer',
                date: '2022 - Present',
                summary: 'Built customer dashboards and fixed critical bugs in the backend API.'
              }
            ]
          }
        }
      },
      targetRole: 'Senior React Developer'
    };

    const response = await fetch('http://localhost:5000/api/gemini/resume-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testResumePayload)
    });

    assert(response.status === 200, `Backend API responded with status 200 (Got ${response.status})`);
    const aiData = await response.json();

    assert(typeof aiData.overallScore === 'number', `AI overallScore is a number (Got ${aiData.overallScore})`);
    assert(typeof aiData.executiveSummary === 'string' && aiData.executiveSummary.length > 20, 'AI generated substantive executive summary');
    assert(Array.isArray(aiData.topRecommendations) && aiData.topRecommendations.length > 0, `AI generated ${aiData.topRecommendations?.length} recommendations`);
    assert(Array.isArray(aiData.bulletRewrites) && aiData.bulletRewrites.length > 0, `AI generated ${aiData.bulletRewrites?.length} Google XYZ bullet rewrites`);
    assert(aiData.bulletRewrites[0].improved.length > aiData.bulletRewrites[0].original.length, 'Rewritten bullet is more comprehensive than original');

    console.log(`   AI Overall Score: ${aiData.overallScore}`);
    console.log(`   AI Grade: ${aiData.scoreGrade}`);
    console.log(`   Sample Rewrite: "${aiData.bulletRewrites[0].improved}"`);
  } catch (err) {
    console.error('   ⚠️ Backend test warning:', err.message);
    throw err;
  }

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`🎉 ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (100% SUCCESS RATE)`);
  console.log('=================================================================\n');
}

runAllTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
