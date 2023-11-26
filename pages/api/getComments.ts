import type { NextApiRequest, NextApiResponse } from "next";
import data from "../../comments.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { photoId } = req.query;

  if (!photoId) {
    return res.status(400).json({ error: "Missing photoId parameter" });
  }

  const photoIdString = Array.isArray(photoId) ? photoId[0] : photoId;

  const filteredComments = data.comments.filter(
    (comment) => comment.photoId === parseInt(photoIdString)
  );

  res.status(200).json(filteredComments);
}
