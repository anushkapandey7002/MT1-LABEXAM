
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = [];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Employee Task Management</h1>");
    }
    else if (pathname === "/tasks" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tasks));
    }
    else if (pathname === "/about" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Employee Task Management Application");
    }
    else if (pathname === "/home" && req.method === "GET") {
        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading HTML file");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
    else if (pathname === "/add-task" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const task = JSON.parse(body);
                const { id, taskName, assignedTo, status } = task;

                if (
                    id === undefined || id === null ||
                    !taskName || !assignedTo || !status
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        message: "id, taskName, assignedTo and status are required"
                    }));
                    return;
                }

                tasks.push({ id, taskName, assignedTo, status });

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task
                }));
            } catch {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    message: "Invalid JSON request"
                }));
            }
        });
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 - Route not found");
    }
});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
