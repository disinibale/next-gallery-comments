import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

const dataFilePath = path.resolve("./comments.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { photoId, content } = req.body;
    const commentId = uuid();
    const createdAt = new Date().toISOString();

    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(rawData);

    data.comments.push({ id: commentId, photoId, content, createdAt });

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    res.status(201).json({
      message: "Comment Successfully created!",
      data: {
        id: commentId,
        photoId,
        content,
        createdAt,
      },
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
