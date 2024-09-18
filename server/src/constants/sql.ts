export const TABLE_NAME = 'duties' as const;
export const SQL = {
    createTable: `
        CREATE TABLE ${TABLE_NAME}(
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            assignee TEXT NOT NULL,
            creator TEXT NOT NULL,
            priority TEXT CHECK(priority IN ('low', 'medium', 'high')) NOT NULL,
            status TEXT CHECK(status IN ('todo', 'in-progress', 'done')) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `,
    createDuty: `
        INSERT INTO ${TABLE_NAME} (title, description, assignee, creator, priority, status)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
`,
    getDuties: `
        SELECT * FROM ${TABLE_NAME};
    `,
    getDutyById: `
        SELECT * FROM ${TABLE_NAME} WHERE id = $1;
    `,
    updateDutyById: `
        UPDATE ${TABLE_NAME}
        SET title = $1, description = $2, assignee = $3, creator = $4, priority = $5, status = $6
        WHERE id = $7 RETURNING *;
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
