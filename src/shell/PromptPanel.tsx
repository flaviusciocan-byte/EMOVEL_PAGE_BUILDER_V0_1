import { useMemo, useState } from 'react';
import { usePuck } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import {
  generatePageSpecFromPrompt,
  PAGE_GENERATION_PRESETS,
  type PageGenerationPreset,
} from '../builder/prompt-to-page';
import { pageSpecToPuckData } from '../builder/page-spec-to-puck';
import type { PageSpec }           from '../builder/page-spec';
import { buildRegistryPageSchema } from '../composer/composer';
import { validatePageSchema }      from '../composer/page-schema-validator';
import { pageSchemaToPuckData }    from '../composer/page-schema-to-puck';
import type { ValidatorManifest }  from '../composer/page-schema-validator';
import manifestJson                from '../../registry.manifest.json';
import { initialData }             from '../builder/puck.config';

const STORAGE_KEY = 'emovel-page-data';

const SAMPLE_PROMPT =
  'Create a SaaS page for EMOVEL Page Builder with gallery screenshots, customer testimonials, pricing plans, newsletter signup, and footer.';

// Minimal shape stored after a successful Registry Composer run.
interface ComposerMeta {
  title:      string;
  components: Array<{ registryName: string }>;
}

function downloadJSON(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function PromptPanel() {
  const { dispatch } = usePuck();
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT);
  const [preset, setPreset] = useState<PageGenerationPreset>('auto');
  const [lastSpec, setLastSpec] = useState<PageSpec | null>(null);
  const [status, setStatus] = useState('');
  const [composerErrors, setComposerErrors] = useState<string[]>([]);
  const [lastComposerMeta, setLastComposerMeta] = useState<ComposerMeta | null>(null);

  const previewSpec = useMemo(
    () => generatePageSpecFromPrompt(prompt, preset),
    [prompt, preset],
  );

  function handleGenerate() {
    const spec = generatePageSpecFromPrompt(prompt, preset);
    const data = pageSpecToPuckData(spec);
    dispatch({ type: 'setData', data: data as Partial<Data> });
    setLastSpec(spec);
    setLastComposerMeta(null);
    setStatus(`Loaded ${spec.sections.length} sections into Puck.`);
  }

  function handleExportSpec() {
    const spec = lastSpec ?? previewSpec;
    downloadJSON(`${spec.slug}.pagespec.json`, spec);
    setStatus('PageSpec exported.');
  }

  function handleGenerateRegistryComposer() {
    setComposerErrors([]);
    const schema     = buildRegistryPageSchema(prompt, manifestJson as ValidatorManifest);
    const validation = validatePageSchema(schema, manifestJson as ValidatorManifest);
    if (!validation.valid) {
      setComposerErrors(validation.errors);
      setStatus('[Registry] Validation failed — schema errors below.');
      return;
    }
    const data = pageSchemaToPuckData(schema);
    // Clear stale canvas before loading new generated data.
    // Best-effort: removeItem can throw SecurityError in sandboxed/restricted contexts.
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* unavailable — proceed */ }
    dispatch({ type: 'setData', data: data as Partial<Data> });
    setComposerErrors([]);
    setLastComposerMeta({ title: schema.title, components: schema.components });
    setStatus(`[Registry] Loaded ${schema.components.length} validated sections.`);
  }

  function handleClearCanvas() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* unavailable — proceed */ }
    dispatch({ type: 'setData', data: initialData as Partial<Data> });
    setLastComposerMeta(null);
    setComposerErrors([]);
    setStatus('Canvas cleared.');
  }

  // Meta block: show Registry Composer result when available; fall back to PageSpec preview.
  const metaTitle     = lastComposerMeta?.title          ?? previewSpec.title;
  const metaSections  = lastComposerMeta?.components.length ?? previewSpec.sections.length;
  const metaGenerator = lastComposerMeta ? 'Registry Composer v1' : previewSpec.meta.generator;

  return (
    <div className="emovel-prompt">
      <style>{`
        .emovel-prompt {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 14px;
          color: var(--shell-text);
          font-family: "Satoshi", system-ui, sans-serif;
        }

        .emovel-prompt__label {
          margin: 0;
          color: var(--shell-text2);
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .emovel-prompt__textarea {
          width: 100%;
          min-height: 152px;
          padding: 10px 11px;
          border: 1px solid var(--shell-b2);
          border-radius: 6px;
          background: #101015;
          color: var(--shell-text);
          font: 500 12px/1.55 "Satoshi", system-ui, sans-serif;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
        }

        .emovel-prompt__textarea:focus {
          border-color: var(--shell-blue);
          box-shadow: 0 0 0 1px rgba(92, 200, 255, 0.22);
        }

        .emovel-prompt__select {
          width: 100%;
          min-height: 32px;
          padding: 0 10px;
          border: 1px solid var(--shell-b2);
          border-radius: 6px;
          background: #101015;
          color: var(--shell-text);
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          outline: none;
        }

        .emovel-prompt__select:focus {
          border-color: var(--shell-blue);
          box-shadow: 0 0 0 1px rgba(92, 200, 255, 0.22);
        }

        .emovel-prompt__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .emovel-prompt__button {
          min-width: 0;
          min-height: 32px;
          border: 1px solid var(--shell-b2);
          border-radius: 6px;
          background: #15151a;
          color: var(--shell-text);
          font-family: var(--shell-mono);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .emovel-prompt__button:hover {
          border-color: var(--shell-b3);
        }

        .emovel-prompt__button--primary {
          border-color: #D4AF37;
          background: linear-gradient(135deg, #D4AF37 0%, #b8931a 100%);
          color: #080808;
        }

        .emovel-prompt__meta {
          display: grid;
          gap: 8px;
          padding: 11px;
          border: 1px solid var(--shell-b1);
          border-radius: 6px;
          background: rgba(255,255,255,0.025);
        }

        .emovel-prompt__row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: var(--shell-text3);
          font-family: var(--shell-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .emovel-prompt__row strong {
          color: var(--shell-text2);
          font-weight: 600;
          text-align: right;
        }

        .emovel-prompt__status {
          min-height: 18px;
          color: #4ade80;
          font-size: 11px;
          line-height: 1.45;
        }

        .emovel-prompt__button--registry {
          border-color: rgba(92, 200, 255, 0.4);
          background: rgba(92, 200, 255, 0.06);
          color: #5cc8ff;
        }

        .emovel-prompt__button--registry:hover {
          border-color: rgba(92, 200, 255, 0.65);
          background: rgba(92, 200, 255, 0.1);
        }

        .emovel-prompt__composer-errors {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px;
          border: 1px solid rgba(255, 80, 80, 0.3);
          border-radius: 6px;
          background: rgba(255, 80, 80, 0.04);
        }

        .emovel-prompt__composer-error {
          color: #ff6b6b;
          font-family: var(--shell-mono);
          font-size: 9px;
          letter-spacing: 0.04em;
          line-height: 1.6;
        }

      `}</style>

      <p className="emovel-prompt__label">Prompt to page</p>
      <select
        className="emovel-prompt__select"
        value={preset}
        onChange={(event) => {
          setPreset(event.target.value as PageGenerationPreset);
          setStatus('');
        }}
        aria-label="Page generation preset"
      >
        {PAGE_GENERATION_PRESETS.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>

      <textarea
        className="emovel-prompt__textarea"
        value={prompt}
        onChange={(event) => {
          setPrompt(event.target.value);
          setStatus('');
          setLastComposerMeta(null);
        }}
        spellCheck={false}
        aria-label="Page generation prompt"
      />

      <div className="emovel-prompt__actions">
        <button
          type="button"
          className="emovel-prompt__button emovel-prompt__button--primary"
          onClick={handleGenerate}
        >
          Generate Page
        </button>
        <button
          type="button"
          className="emovel-prompt__button"
          onClick={handleExportSpec}
        >
          Export PageSpec
        </button>
      </div>

      <div className="emovel-prompt__actions">
        <button
          type="button"
          className="emovel-prompt__button emovel-prompt__button--registry"
          onClick={handleGenerateRegistryComposer}
          style={{ gridColumn: '1 / -1' }}
        >
          Compose Page
        </button>
      </div>

      <div className="emovel-prompt__actions">
        <button
          type="button"
          className="emovel-prompt__button"
          onClick={handleClearCanvas}
          style={{ gridColumn: '1 / -1' }}
        >
          Clear Canvas
        </button>
      </div>

      <div className="emovel-prompt__meta" aria-label="Generated page summary">
        <div className="emovel-prompt__row">
          <span>Title</span>
          <strong>{metaTitle}</strong>
        </div>
        <div className="emovel-prompt__row">
          <span>Sections</span>
          <strong>{metaSections}</strong>
        </div>
        <div className="emovel-prompt__row">
          <span>Generator</span>
          <strong>{metaGenerator}</strong>
        </div>
      </div>

      <div className="emovel-prompt__status" role="status">
        {status}
      </div>

      {composerErrors.length > 0 && (
        <div className="emovel-prompt__composer-errors" role="alert" aria-label="Registry Composer errors">
          {composerErrors.map((err, i) => (
            <div key={i} className="emovel-prompt__composer-error">{err}</div>
          ))}
        </div>
      )}
    </div>
  );
}
