import { SQL } from './constants/sql'
import { MOCK_DUTIES } from './constants/data'
import { client } from './db'

const run = async (callback: () => Promise<void>) => {
    try {
        await client.connect();
        await callback();
    } catch (error) {
        console.error('SQL Error: ', error?.stack);
    } finally {
        await client.end();
    }
};

// run command by command line
const args = process?.argv?.slice(2);
if (args[0] === 'setup') {
    run(async () => {
        await client.query(SQL.createTable);
    })
} else if (args[0] === 'drop') {
    run(async () => {
        await client.query(SQL.dropTable);
    })
} else if (args[0] === 'mock') {
    run(async () => {
        const isTableExists = await client.query(SQL.checkTableExists);
        if (!isTableExists.rows[0].exists) {
            await client.query(SQL.createTable);
        }
        for (const duty of MOCK_DUTIES) {
            await client.query(SQL.createDuty, [duty.title, duty.description, duty.assignee, duty.creator, duty.priority,duty.status]);
        }
    })
} else {
    console.log('Invalid command');
}