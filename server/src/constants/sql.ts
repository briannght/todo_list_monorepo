export const TABLE_NAME = 'duties' as const;
export const SQL = {
    createTable: `
        CREATE TABLE ${TABLE_NAME}(
            id SERIAL PRIMARY KEY,
            description VARCHAR(255) NOT NULL,
            assignee VARCHAR(100),
            completed BOOLEAN DEFAULT FALSE
        );
    `,
    createDuty: `
        INSERT INTO ${TABLE_NAME}(description, assignee) VALUES ($1, $2) RETURNING *;
`,
    getDuties: `
        SELECT * FROM ${TABLE_NAME};
    `,
    getDutyById: `
        SELECT * FROM ${TABLE_NAME} WHERE id = $1;
    `,
    updateDutyById: `
        UPDATE ${TABLE_NAME} SET description = $1, assignee = $2, completed = $3 WHERE id = $4 RETURNING *;
    `,
    deleteDutyById: `
        DELETE FROM ${TABLE_NAME} WHERE id = $1;
    `,
    dropTable: `
        DROP TABLE ${TABLE_NAME};
    `,
    checkTableExists: `
        SELECT EXISTS (
            SELECT 1
            FROM pg_tables
            WHERE tablename = '${TABLE_NAME}'
        );
    `,
} as const;
