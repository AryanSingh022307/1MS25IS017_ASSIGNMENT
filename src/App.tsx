/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Brain, FileText, Sparkles, BookOpen, ChevronRight, Layers, HelpCircle, Compass } from 'lucide-react';
import { AcademicLevel, ResearchPlan } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { NoticeBanner } from './components/NoticeBanner.tsx';
import { TopicForm } from './components/TopicForm.tsx';
import { CollapsibleSection } from './components/CollapsibleSection.tsx';
import { PlanActions } from './components/PlanActions.tsx';
import { HistorySidebar } from './components/HistorySidebar.tsx';
import { LoadingState } from './components/LoadingState.tsx';
import { ErrorAlert } from './components/ErrorAlert.tsx';

// Pre-seeded starter session item for initial exploration following the 8-step CoT procedure
const INITIAL_DEMO_PLAN: ResearchPlan = {
  id: 'demo-plan-zkp',
  topic: 'Zero-Knowledge Proofs in Decentralized Identity Verification',
  level: 'Masters',
  focusDetails: 'Proof efficiency on mobile devices and GDPR compliance',
  reasoningSteps: `1. Clarify: Applied cryptography and distributed identity architectures; audience is graduate researchers and software engineers.
2. Decompose: (a) How do proof generation and verification overheads compare across zk-SNARKs, zk-STARKs, and Bulletproofs? (b) How can verifiable credentials be revoked without violating zero-knowledge unlinkability? (c) How can blockchain immutability reconcile with privacy mandates (e.g., GDPR Article 17 right to erasure)? (d) What client-side mobile hardware bottlenecks exist?
3. Search plan: keywords "zero-knowledge proofs", "zk-SNARK", "decentralized identity", "verifiable credentials", "selective disclosure"; databases: IEEE Xplore, IACR ePrint, ACM Digital Library, USENIX Security.
4. Landscape: zk-SNARKs provide the most compact proof sizes (~130 bytes), but trusted setup and mobile prover complexity remain challenging; transparent STARKs avoid trusted setup at the expense of larger payload bandwidth.
5. Reading list: seminal works by Goldwasser et al. (1985) [verify], Groth (2016) Groth16 [verify], Ben-Sasson et al. (2018) zk-STARKs [verify], and W3C DID specifications [verify].
6. Gaps: client-side delegated proving without side-channel leaks; scalable accumulator-based credential revocation.
7. Outline: IMRaD review structure evaluating cryptographic primitives and identity protocols.`,
  finalAnswer: `- **Topic summary**: Systematic assessment of zero-knowledge proofs (zk-SNARKs, zk-STARKs, Bulletproofs) applied to privacy-preserving decentralized identity and verifiable credentials.
- **Sub-questions**:
  1. Performance trade-offs: prover time vs. proof byte size vs. verification latency across mobile devices.
  2. Unlinkable revocation: non-membership cryptographic accumulator techniques.
  3. Regulatory compliance: reconciling distributed ledger immutability with GDPR right-to-erasure requirements.
- **Search queries**:
  - \`"zero-knowledge" AND ("decentralized identity" OR "verifiable credential*") AND "selective disclosure"\`
  - \`"zk-SNARK" AND "revocation accumulator" AND "privacy-preserving"\`
- **Key themes**: Cryptographic compactness, trusted setup vs. transparency, mobile prover feasibility, verifiable data registries.
- **Suggested reading**:
  - Goldwasser, Micali, & Rackoff (1985) *"The Knowledge Complexity of Interactive Proof-Systems"* [verify]
  - Camenisch & Lysyanskaya (2001) *"An Efficient System for Non-transferable Anonymous Credentials"* [verify]
  - Groth (2016) *"On the Size of Pairing-based Non-interactive Arguments"* (Groth16) [verify]
  - Ben-Sasson et al. (2018) *"Scalable, Transparent, and Post-Quantum Secure Computational Integrity (zk-STARKs)"* [verify]
  - Bünz et al. (2018) *"Bulletproofs: Short Proofs for Confidential Transactions"* [verify]
  - W3C Working Group *"Decentralized Identifiers (DIDs) v1.0"* [verify]
- **Research gaps**: Delegated mobile proving without timing leakage; dynamic accumulator witness synchronization under high concurrency.
- **Paper outline**:
  1. Introduction & Problem Statement (selective disclosure in digital identity)
  2. Theoretical Foundations of Non-Interactive Zero-Knowledge Arguments
  3. Comparative Cryptographic Analysis (SNARKs vs. STARKs vs. Bulletproofs)
  4. Identity Protocol Architectures & Revocation Schemes
  5. Empirical Evaluation on Mobile Edge Devices
  6. Open Challenges & Future Directions
  7. Conclusion
- **Next actions**:
  - Run the IEEE and IACR search queries and collect 15 benchmark papers.
  - Verify citation DOIs and authors on Google Scholar for all flagged papers.
  - Construct a comparative matrix benchmarking proof generation times on ARM architectures.`,
  rawText: '',
  generatedAt: new Date().toISOString(),
};

export default function App() {
  const [topic, setTopic] = useState<string>('');
  const [level, setLevel] = useState<AcademicLevel>('Masters');
  const [focusDetails, setFocusDetails] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<ResearchPlan | null>(INITIAL_DEMO_PLAN);
  const [history, setHistory] = useState<ResearchPlan[]>([INITIAL_DEMO_PLAN]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load history from session storage if available
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('paperpilot_history');
      if (stored) {
        const parsed: ResearchPlan[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentPlan(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Could not read session history', e);
    }
  }, []);

  // Save history to session storage
  const saveToSession = (newHistory: ResearchPlan[]) => {
    try {
      sessionStorage.setItem('paperpilot_history', JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Could not save session history', e);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          level,
          focusDetails: focusDetails.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate literature review plan.');
      }

      const newPlan: ResearchPlan = {
        id: `plan-${Date.now()}`,
        topic: data.topic,
        level: data.level,
        focusDetails: data.focusDetails || undefined,
        reasoningSteps: data.reasoningSteps,
        finalAnswer: data.finalAnswer,
        rawText: data.rawText,
        generatedAt: data.generatedAt,
      };

      setCurrentPlan(newPlan);
      const updatedHistory = [newPlan, ...history.filter((h) => h.id !== newPlan.id)];
      setHistory(updatedHistory);
      saveToSession(updatedHistory);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setError(
        err.message ||
          'A network or server error occurred. Please verify your connection and Gemini API key.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: ResearchPlan) => {
    setCurrentPlan(plan);
    setTopic(plan.topic);
    setLevel(plan.level);
    setFocusDetails(plan.focusDetails || '');
    setError(null);
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    saveToSession(updated);
    if (currentPlan?.id === id) {
      setCurrentPlan(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveToSession([]);
    setCurrentPlan(null);
  };

  const handleClearCurrent = () => {
    setCurrentPlan(null);
    setTopic('');
    setFocusDetails('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky App Header */}
      <Header
        historyCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Session History Sidebar */}
        <HistorySidebar
          history={history}
          activePlanId={currentPlan?.id || null}
          onSelectPlan={handleSelectPlan}
          onDeletePlan={handleDeletePlan}
          onClearHistory={handleClearHistory}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Citation Verification Notice (Requirement 6) */}
          <NoticeBanner />

          {/* Research Topic Formulation Form */}
          <TopicForm
            topic={topic}
            setTopic={setTopic}
            level={level}
            setLevel={setLevel}
            focusDetails={focusDetails}
            setFocusDetails={setFocusDetails}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onClear={handleClearCurrent}
            hasActivePlan={!!currentPlan}
          />

          {/* Error Message Alert */}
          {error && (
            <ErrorAlert
              message={error}
              onRetry={() => handleSubmit()}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Loading Animation with Progressive Steps */}
          {isLoading && (
            <LoadingState topic={topic || 'Academic Research Query'} level={level} />
          )}

          {/* Plan Display Sections */}
          {!isLoading && currentPlan && (
            <div className="space-y-6 animate-fadeIn">
              {/* Plan Actions Bar (Copy, Download .txt, Clear) */}
              <PlanActions plan={currentPlan} onClear={handleClearCurrent} />

              {/* Section 1: Reasoning Steps (Collapsible) */}
              <CollapsibleSection
                title="Reasoning Steps"
                subtitle="Chain-of-thought breakdown: problem framing, database scoping, boolean formulation & epistemic tensions"
                icon={<Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                content={currentPlan.reasoningSteps || '*No chain-of-thought reasoning steps provided.*'}
                badge="Chain-of-Thought"
                badgeColor="indigo"
                defaultOpen={true}
                highlightVerify={true}
              />

              {/* Section 2: Final Answer (Collapsible, Markdown Rendered) */}
              <CollapsibleSection
                title="Final Answer: Literature Review Plan"
                subtitle={`Publication-ready literature review blueprint calibrated for ${currentPlan.level} level`}
                icon={<Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                content={currentPlan.finalAnswer || '*No final literature review plan content.*'}
                badge={`${currentPlan.level} Review`}
                badgeColor="emerald"
                defaultOpen={true}
                highlightVerify={true}
              />
            </div>
          )}

          {/* Empty State when no plan is selected */}
          {!isLoading && !currentPlan && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
                Ready to Architect Your Literature Review
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Enter your research topic above, choose your academic depth (Undergraduate, Masters, PhD), and click "Generate Literature Review Plan".
              </p>
            </div>
          )}

          {/* Footer Reference */}
          <footer className="pt-8 pb-4 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-slate-800/60">
            <p>
              PaperPilot • Built with Gemini 3.8 Flash Chain-of-Thought Reasoning
            </p>
            <p className="mt-1 text-[11px]">
              Remember: Always verify academic citations marked with <span className="text-amber-600 dark:text-amber-400 font-mono font-medium">[verify]</span> on Google Scholar or official publisher portals.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
