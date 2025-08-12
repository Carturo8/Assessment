import fs from "fs";
import csv from "csv-parser";
import { db } from '../config/db.js';

let inserts = [];

export const uploadClientsCSV = async () => {
    fs.createReadStream("clients.csv")
        .pipe(csv())
        .on("data", (row) => {
            const insertPromise = db.query(
                "INSERT INTO clients (client_id, client_name, client_address, client_phone, client_email) VALUES ($1, $2, $3, $4, $5)",
                [row.client_id, row.client_name, row.client_address, row.client_phone, row.client_email],
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

uploadClientsCSV();