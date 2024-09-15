export type Duty = {
    description: string;
    assignee: string;
    completed: boolean;
};

export const MOCK_DUTIES: Duty[] = [{
    description: 'Duty 1',
    assignee: 'Brian',
    completed: false,
}, {
    description: 'Duty 2',
    assignee: 'Kobe',
    completed: false,
}] as const;