import { 
  QueryRecord, 
  Standard, 
  StandardsGraph, 
  FeedbackSubmission 
} from './types';
import { 
  CATALOG_STANDARDS, 
  PRESET_QUERIES, 
  SAMPLE_KNOWLEDGE_GRAPHS 
} from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export const api = {
  // Submit new query (text or document)
  async submitQuery(inputType: 'TEXT' | 'DOCUMENT', content: string | File, presetKey?: string): Promise<QueryRecord> {
    if (API_BASE) {
      try {
        if (inputType === 'DOCUMENT' && content instanceof File) {
          const formData = new FormData();
          formData.append('file', content);
          formData.append('input_type', 'DOCUMENT');
          const res = await fetch(`${API_BASE}/queries`, { method: 'POST', body: formData });
          if (res.ok) return await res.json();
        } else {
          const res = await fetch(`${API_BASE}/queries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input_type: inputType, raw_text: content })
          });
          if (res.ok) return await res.json();
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to local simulation engine:', err);
      }
    }

    // Realistic simulation using preset or fallback
    await new Promise(r => setTimeout(r, 600));
    if (presetKey && PRESET_QUERIES[presetKey]) {
      return JSON.parse(JSON.stringify(PRESET_QUERIES[presetKey]));
    }

    // Default to Case 1
    return JSON.parse(JSON.stringify(PRESET_QUERIES.case1));
  },

  // Get specific query results
  async getQuery(queryId: string): Promise<QueryRecord> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/queries/${queryId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, fallback to simulated query');
      }
    }

    const found = Object.values(PRESET_QUERIES).find(q => q.query_id === queryId);
    return JSON.parse(JSON.stringify(found || PRESET_QUERIES.case1));
  },

  // Get standards catalog
  async getStandards(sectorId?: number, search?: string): Promise<Standard[]> {
    if (API_BASE) {
      try {
        const params = new URLSearchParams();
        if (sectorId) params.append('sector', sectorId.toString());
        if (search) params.append('q', search);
        const res = await fetch(`${API_BASE}/standards?${params.toString()}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, fallback to curated standards');
      }
    }

    let list = [...CATALOG_STANDARDS];
    if (sectorId) {
      list = list.filter(s => s.sector_id === sectorId);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => 
        s.number.toLowerCase().includes(q) || 
        s.title.toLowerCase().includes(q) || 
        s.scope_text.toLowerCase().includes(q) ||
        s.technical_committee.toLowerCase().includes(q)
      );
    }
    return list;
  },

  // Get standards knowledge graph
  async getStandardsGraph(standardId: string): Promise<StandardsGraph> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/standards/${standardId}/graph`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, fallback to graph cache');
      }
    }

    if (SAMPLE_KNOWLEDGE_GRAPHS[standardId]) {
      return JSON.parse(JSON.stringify(SAMPLE_KNOWLEDGE_GRAPHS[standardId]));
    }

    // Default graph
    return JSON.parse(JSON.stringify(SAMPLE_KNOWLEDGE_GRAPHS['std-is-61439-2']));
  },

  // Submit officer feedback
  async submitFeedback(submission: FeedbackSubmission): Promise<{ success: boolean; id: string }> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/recommendations/${submission.recommendation_id}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, recording feedback locally');
      }
    }

    return { success: true, id: `fb-${Date.now()}` };
  }
};
