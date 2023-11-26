import { NextApiRequest, NextApiResponse } from 'next';
import * as nc from 'next-connect';
import formidable from 'formidable';

import cloudinary from '../../utils/cloudinary';
import { Writable } from 'stream';
import formidableUtils from '../../utils/formidable'
import { parseForm } from '../../utils/parseForm';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<{
        data: { url: string | string[] } | null;
        error: string | null
    }>) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        res.status(405).json({
            data: null,
            error: 'Method Not Allowed!'
        })
        return
    }

    try {
        const { fields, files } = await parseForm(req)

        const { file } = files

        console.log(file)
        await cloudinary.v2.uploader.upload(file[0].filepath, {
            folder: 'gallery'
        })

        res.status(200).json({
            data: null,
            error: null
        })
    } catch (err) {
        if (err instanceof formidable.errors.FormidableError) {
            res.status(err.httpCode || 400).json({ data: null, error: err.message })
        } else {
            console.error(err)
            res.status(500).json({ data: null, error: 'Internal Server error' })
        }
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler;