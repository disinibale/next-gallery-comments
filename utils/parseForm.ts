import formidable from "formidable";
import type { NextApiRequest } from "next";
import mime from "mime";

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 2048 * 2048,
      filter: (part) => {
        return part.mimetype.includes('image')
      }
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
