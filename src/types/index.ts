// User types
export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Event types
export interface Event {
  id: string;
  userId: string;
  title: string;
  date: Date;
  budget: number;
  description: string;
  attendeeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventData {
  title: string;
  date: Date;
  budget: number;
  description: string;
  attendeeCount: number;
}

export interface EventSummary {
  id: string;
  title: string;
  date: Date;
  attendeeCount: number;
}

// Budget Item types
export interface BudgetItem {
  id: string;
  eventId: string;
  description: string;
  amount: number;
  createdAt: Date;
}

export interface BudgetSummary {
  totalSpent: number;
  budgetRemaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
}

// Task types
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  progress: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilters {
  sortBy?: 'priority' | 'date';
  progressFilter?: 'incomplete' | 'in-progress' | 'complete';
}
