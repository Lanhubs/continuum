export type DocumentType = 'LAB_RESULT' | 'PRESCRIPTION' | 'RADIOLOGY' | 'CONSULTATION_NOTE' | 'VACCINATION_RECORD' | 'DISCHARGE_SUMMARY';

export interface DocumentMetadata {
  id: string;
  type: DocumentType;
  date: string;
  summary_message: string;
  overall_stability: number;
  smart_swap_advice?: string;
}

export interface MarkerInterpretation {
  id: string;
  name: string;
  value: number;
  unit: string;
  reference_range: string;
  stability_score: number;
  status_color: 'forest-green' | 'amber' | 'crimson';
  status_label: string;
  interpretation: string;
}

export interface MedicalRecord extends DocumentMetadata {
  markers: MarkerInterpretation[];
  radiology_insight?: any;
  ai_assistant_context?: {
    primary_focus: string;
    partner_note?: string;
    suggested_questions: string[];
    report_integrity: number;
  };
  raw_image_url?: string;
  raw_text?: string;
}

export interface ScanStatus {
  progress: number;
  status: string;
  result?: any;
}

export interface TrendPoint {
  date: string;
  value: number;
}
