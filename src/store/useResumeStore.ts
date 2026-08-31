import { create } from 'zustand';
import {
  ResumeDataState,
  createResumeDataSlice,
  useResumeDataStore,
  createEmptyResume,
  defaultSettings,
  initialResume,
  initialSettings,
} from './slices/useResumeDataStore';
import {
  UIState,
  createUISlice,
  useUIStore,
} from './slices/useUIStore';
import {
  ActivationStoreState,
  createActivationSlice,
  useActivationStore,
  defaultActivation,
  initialActivation,
} from './slices/useActivationStore';

export type ResumeStoreState = ResumeDataState & UIState & ActivationStoreState;

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  ...createResumeDataSlice(set, get),
  ...createUISlice(set),
  ...createActivationSlice(set, get),
}));

export {
  useResumeDataStore,
  useUIStore,
  useActivationStore,
  createEmptyResume,
  defaultSettings,
  initialResume,
  initialSettings,
  defaultActivation,
  initialActivation,
};
