export type DutyPriority = 'high' | 'medium' | 'low';

export type DutyStatus = 'todo' | 'in-progress' | 'done';

export type Duty = {
    title: string;
    description: string;
    assignee: string;
    creator: string;
    priority: DutyPriority;
    status: DutyStatus;
};

export const MOCK_DUTIES: Duty[] = [{
    title: 'Duty 1',
    description: 'Duty 1',
    assignee: 'Brian',
    creator: 'Brian',
    priority: 'low',
    status: 'todo',
}, {
    title: 'Duty 2',
    description: 'Duty 2',
    assignee: 'Kobe',
    creator: 'Brian',
    priority: 'medium',
    status: 'in-progress',
}] as const;