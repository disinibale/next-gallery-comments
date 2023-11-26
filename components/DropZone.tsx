import React, { useState, DragEvent, Suspense } from "react"
import { useRouter } from "next/router";
import resizeImage from "../utils/resizeImage";

export default function DropZone() {
    const router = useRouter()
    const [fileToUpload, setFileToUpload] = useState<File | null>(null)
    const [inDropZone, setInDropZone] = useState<boolean>(false)
    const dropZoneClass = `flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-slate-950 hover:border-gray-500 hover:dark:border-gray-400 ${inDropZone ? "border-gray-500 dark:border-gray-400" : "border-gray-300 dark:border-gray-600"}`;

    const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()

        setInDropZone(true)
    }

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()

        e.dataTransfer.dropEffect = "copy"
        setInDropZone(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setInDropZone(false)
    }

    const handleDrop = async (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const fileList = e.dataTransfer.files

        if (fileList && fileList.length > 0) {
            const file = fileList[0]
            setFileToUpload(file)

            try {
                const resizedImage = await resizeImage(file, 1920, 1080)

                const formData = new FormData()
                formData.append('file', resizedImage)

                const response = await fetch('api/uploadImage', {
                    method: 'POST',
                    body: formData
                })

                if (response.ok) {
                    const data = await response.json()
                    router.push('/', undefined, { shallow: true })
                    setTimeout(() => {
                        window.location.reload();
                    }, 25)
                } else {
                    console.error('Upload Failed', response.statusText)
                }

                console.log(resizedImage)
                setFileToUpload(null)
                setInDropZone(false)
            } catch (err) {
                console.error('Error on Uploading file', err)
                setFileToUpload(null)
                setInDropZone(false)
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.currentTarget.files

        if (fileList && fileList.length > 0) {
            const file = fileList[0]
            setFileToUpload(file)

            try {
                const resizedImage = await resizeImage(file, 1920, 1080)

                const formData = new FormData()
                formData.append('file', resizedImage)

                const response = await fetch('api/uploadImage', {
                    method: 'POST',
                    body: formData
                })

                if (response.ok) {
                    const data = await response.json()
                    router.push('/', undefined, { shallow: true })
                    setTimeout(() => {
                        window.location.reload();
                    }, 25)
                } else {
                    console.error('Upload Failed', response.statusText)
                }

                console.log(resizedImage)
                setFileToUpload(null)
                setInDropZone(false)
            } catch (err) {
                console.error('Error on Uploading file', err)
                setFileToUpload(null)
                setInDropZone(false)
            }
        }
    }

    return (
        <>
            <form className="w-full h-full">
                <label
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    htmlFor="dropzone-file"
                    className={dropZoneClass}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {fileToUpload ?
                            (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24" /> Processing Upload
                                </>
                            )
                            : (
                                <>
                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 1080x1980px)</p>
                                </>
                            )
                        }
                    </div>
                    <input
                        className="w-full h-full absolute opacity-0 hover:cursor-pointer"
                        type="file"
                        id="dropzone-file"
                        onDrop={handleDrop}
                        onChange={handleFileChange}
                    />
                </label>
            </form>
        </>
    )
}