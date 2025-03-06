const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;
const JSON_FOLDER = path.resolve(__dirname, "json-data");
const BUILD_FOLDER = path.resolve(__dirname, "../build");

app.use(cors());
app.use(express.json());

// TP{nn} ディレクトリ内の JSON ファイルを提供する API
app.get("/json/TP:nn/:filename", (req, res) => {
    const { nn, filename } = req.params;
    const dirPath = path.join(JSON_FOLDER, `TP${nn}`);
    const filePath = path.join(dirPath, filename);

    if (!fs.existsSync(dirPath)) {
        return res.status(404).json({ error: `Directory TP${nn} not found` });
    }
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: `File ${filename} not found in TP${nn}` });
    }

    res.sendFile(filePath);
});

// フロントエンドのビルド済みファイルを提供
app.use(express.static(BUILD_FOLDER));
app.get("*", (req, res) => {
    res.sendFile(path.join(BUILD_FOLDER, "index.html"));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
