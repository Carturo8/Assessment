import fs from "fs";
import csv from "csv-parser";
import { db } from '../config/db.js';

let inserts = [];

export const uploadInvoicesCSV = async () => {
    fs.createReadStream("invoices.csv")
        .pipe(csv())
        .on("data", (row) => {
            const insertPromise = db.query(
                "INSERT INTO invoices (invoice_id, invoice_date, invoiced_amount, amount_paid, client_id) VALUES ($1, $2, $3, $4, $5)",
                [row.invoice_id, row.invoice_date, row.invoiced_amount, row.amount_paid, row.client_id],
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

uploadInvoicesCSV();