import { useMemo, useState } from 'react';
import { usePuck } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import {
  generatePageSpecFromPrompt,
  PAGE_GENERATION_PRESETS,
  type PageGenerationPreset,
} from '../builder/prompt-to-page';
import { pageSpecToPuckData } from '../builder/page-spec-to-puck';
import type { PageSpec } from '../builder/page-spec';

const SAMPLE_PROMPT =
  'Create an EMOVEL landing page for the Page Builder: prompt-generated editable pages, premium hero, feature grid, offer, pricing, CTA, FAQ, and footer.';

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

  const previewSpec = useMemo(
    () => generatePageSpecFromPrompt(prompt, preset),
    [prompt, preset],
  );

  function handleGenerate() {
    const spec = generatePageSpecFromPrompt(prompt, preset);
    const data = pageSpecToPuckData(spec);
    dispatch({ type: 'setData', data: data as Partial<Data> });
    setLastSpec(spec);
    setStatus(`Loaded ${spec.sections.length} sections into Puck.`);
  }

  function handleExportSpec() {
    const spec = lastSpec ?? previewSpec;
    downloadJSON(`${spec.slug}.pagespec.json`, spec);
    setStatus('PageSpec exported.');
  }

  return (
    <div className="emovel-prompt">
      <style>{`
        .emovel-prompt {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 14px;
          color: var(--shell-text);
          font-family: "Hanken Grotesk", Inter, ui-sans-serif, system-ui, sans-serif;
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
          font: 500 12px/1.55 "Hanken Grotesk", Inter, sans-serif;
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

      <div className="emovel-prompt__meta" aria-label="Generated page summary">
        <div className="emovel-prompt__row">
          <span>Title</span>
          <strong>{previewSpec.title}</strong>
        </div>
        <div className="emovel-prompt__row">
          <span>Sections</span>
          <strong>{previewSpec.sections.length}</strong>
        </div>
        <div className="emovel-prompt__row">
          <span>Generator</span>
          <strong>{previewSpec.meta.generator}</strong>
        </div>
      </div>

      <div className="emovel-prompt__status" role="status">
        {status}
      </div>
    </div>
  );
}
