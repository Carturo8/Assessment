import fs from "fs";
import csv from "csv-parser";
import { db } from '../config/db.js';

let inserts = [];

export const uploadPlatformsCSV = async () => {
    fs.createReadStream("platforms.csv")
        .pipe(csv())
        .on("data", (row) => {
            const insertPromise = db.query(
                "INSERT INTO platforms (platform_id, platform_name) VALUES ($1, $2)",
                [row.platform_id, row.platform_name],
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

uploadPlatformsCSV();