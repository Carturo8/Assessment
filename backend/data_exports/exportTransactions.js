import fs from "fs";
import csv from "csv-parser";
import { db } from '../config/db.js';

let inserts = [];

export const uploadTransactionsCSV = async () => {
    fs.createReadStream("transactions.csv")
        .pipe(csv())
        .on("data", (row) => {
            const insertPromise = db.query(
                "INSERT INTO transactions (transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type, client_id, platform_id, invoice_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                [row.transaction_id, row.transaction_date, row.transaction_amount, row.transaction_status, row.transaction_type, row.client_id, row.platform_id, row.invoice_id],
                (error, results) => {
                    if (error) throw error;
                    console.log(`Inserted row: ${results.affectedRows}`);
                }
            );

            inserts.push(insertPromise);

        })
        .on("end", async () => {
            try {
                await Promise.all(inserts);
                console.log(`Inserted ${inserts.length} rows successfully.`);
            } catch (err) {
                console.error("Error inserting data:", err);
            }
        });
};

uploadTransactionsCSV();