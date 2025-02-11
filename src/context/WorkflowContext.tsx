'use client';

import { WorkflowInfo } from '@/types/WorkflowInfo';
import { createContext, useContext, useState, ReactNode } from 'react';

interface WorkflowContextType {
  selectedWorkflow: WorkflowInfo | null;
  setSelectedWorkflow: (workflow: WorkflowInfo | null) => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInfo | null>(null);

  return (
    <WorkflowContext.Provider value={{ selectedWorkflow, setSelectedWorkflow }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within a WorkflowProvider');
  }
  return context;
};