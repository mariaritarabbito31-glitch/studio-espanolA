// js/api.js — Anthropic API communication layer

const API = (() => {
  const ENDPOINT = 'https://api.anthropic.com/v1/messages';
  const MODEL    = 'claude-sonnet-4-20250514';

  /** Retrieve stored API key */
  function getKey() {
    return localStorage.getItem('anthropic_api_key') || '';
  }

  /** Persist API key */
  function setKey(key) {
    localStorage.setItem('anthropic_api_key', key.trim());
  }

  /** Clear stored key */
  function clearKey() {
    localStorage.removeItem('anthropic_api_key');
  }

  /**
   * Send a message to Claude.
   * @param {string} userPrompt
   * @param {string} systemPrompt
   * @param {number} maxTokens
   * @returns {Promise<string>} text response
   */
  async function send(userPrompt, systemPrompt = '', maxTokens = 1000) {
    const key = getKey();
    if (!key) throw new Error('NO_KEY');

    const body = {
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: userPrompt }]
    };
    if (systemPrompt) body.system = systemPrompt;

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    return data.content.map(c => c.text || '').join('');
  }

  /**
   * Validate a key with a minimal test call.
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async function validateKey(key) {
    const tmpKey = getKey();
    setKey(key);
    try {
      await send('Di solo: OK', '', 10);
      return true;
    } catch {
      setKey(tmpKey);
      return false;
    }
  }

  return { getKey, setKey, clearKey, send, validateKey };
})();
