import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { variants } from '../utils/animationVariants'
import downloadPhoto from '../utils/downloadPhoto'
import { range } from '../utils/range'
import dateFormatter from '../utils/dateFormatter'
import type { CommentDataType, ImageProps, SharedModalProps } from '../utils/types'
import Twitter from './Icons/Twitter'

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [comments, setComments] = useState<CommentDataType[]>([])
  const [inputComment, setInputComment] = useState<string>(undefined)
  const [loadingPostComment, setLoadingPostComment] = useState<boolean>(false)

  let filteredImages = images?.filter((img: ImageProps) =>
    range(index - 15, index + 15).includes(img.id)
  )

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        changePhotoId(index + 1)
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1)
      }
    },
    trackMouse: true,
  })

  let currentImage = images ? images[index] : currentPhoto

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoadingPostComment(true)
    try {
      const response = await fetch('/api/postComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: inputComment,
          photoId: index
        })
      })
      const responseData = await response.json()
      setInputComment('')
      fetchComments()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPostComment(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/getComments?photoId=${index}`)
      const commentsData = await response.json()
      setComments(commentsData)
    } catch (err) {
      console.error('Error fetching comments', err)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [index, loadingPostComment])


  console.log(inputComment)

  return (
    <MotionConfig
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-50 flex aspect-[3/2] w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
        {...handlers}
      >
        {/* Main image */}
        <div className="w-full overflow-hidden">
          <div className="relative aspect-[3/2] items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute"
              >
                <Image
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                    }/image/upload/c_scale,${navigation ? 'w_1280' : 'w_1920'}/${currentImage.public_id
                    }.${currentImage.format}`}
                  width={navigation ? 1280 : 1920}
                  height={navigation ? 853 : 1280}
                  priority
                  alt="Next.js Conf image"
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Buttons + bottom nav bar */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {/* Buttons */}
          {loaded && (
            <div className="relative aspect-[3/2] max-h-full w-full">
              {navigation && (
                <>
                  {index > 0 && (
                    <button
                      className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: 'translate3d(0, 0, 0)' }}
                      onClick={() => changePhotoId(index - 1)}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {index + 1 < images.length && (
                    <button
                      className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: 'translate3d(0, 0, 0)' }}
                      onClick={() => changePhotoId(index + 1)}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white">
                {navigation ? (
                  <a
                    href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    target="_blank"
                    title="Open fullsize version"
                    rel="noreferrer"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </a>
                ) : (
                  <a
                    href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20pic%20from%20Next.js%20Conf!%0A%0Ahttps://nextjsconf-pics.vercel.app/p/${index}`}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    target="_blank"
                    title="Open fullsize version"
                    rel="noreferrer"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                <button
                  onClick={() =>
                    downloadPhoto(
                      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`,
                      `${index}.jpg`
                    )
                  }
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                {/* Comments Button */}
                <button
                  onClick={() => setIsCommentOpen(!isCommentOpen)}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  title="Comments"
                >
                  <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={() => closeModal()}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                >
                  {navigation ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Bottom Nav bar */}
          {navigation && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div
                initial={false}
                className="mx-auto mt-6 mb-6 flex aspect-[3/2] h-14"
              >
                <AnimatePresence initial={false}>
                  {filteredImages.map(({ public_id, format, id }) => (
                    <motion.button
                      initial={{
                        width: '0%',
                        x: `${Math.max((index - 1) * -100, 15 * -100)}%`,
                      }}
                      animate={{
                        scale: id === index ? 1.25 : 1,
                        width: '100%',
                        x: `${Math.max(index * -100, 15 * -100)}%`,
                      }}
                      exit={{ width: '0%' }}
                      onClick={() => changePhotoId(id)}
                      key={id}
                      className={`${id === index
                        ? 'z-20 rounded-md shadow shadow-black/50'
                        : 'z-10'
                        } ${id === 0 ? 'rounded-l-md' : ''} ${id === images.length - 1 ? 'rounded-r-md' : ''
                        } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
                    >
                      <Image
                        alt="small photos on the bottom"
                        width={180}
                        height={120}
                        className={`${id === index
                          ? 'brightness-110 hover:brightness-110'
                          : 'brightness-50 contrast-125 hover:brightness-75'
                          } h-full transform object-cover transition`}
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_180/${public_id}.${format}`}
                      />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
          {isCommentOpen && (
            <div className='absolute w-1/3 h-1/3 bg-slate-800 shadow-md right-3 top-16 rounded-md flex flex-col justify-between'>
              <div className='grow flex flex-col h-52 w-full bg-slate-700 rounded-t-md'>
                <div className='flex flex-row bg-slate-800 rounded-t-md shadow-sm justify-between px-6 text-white py-3 border-b-[1px] border-slate-700'>
                  <h1>Comments</h1>
                  <button onClick={() => setIsCommentOpen(false)}><XMarkIcon className='w-5 h-5' /></button>
                </div>
                <div className='flex flex-col gap-6 grow overflow-x-hidden overflow-y-auto py-4 px-4'>
                  {
                    comments.map((comment) => {
                      return (
                        <div className='text-gray-200 text-right font-semibold flex flex-col' key={comment.id}>
                          <span className='bg-slate-600 p-2 rounded-md'>
                            {comment.content} <br />
                            <small className='text-xs font-light'>{dateFormatter(comment.createdAt)}</small>
                          </span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className='flex flex-row'>
                <form onSubmit={handleSubmitComment}>
                  <input
                    onChange={(e) => setInputComment(e.target.value)}
                    className='px-6 h-[48px] outline-none bg-transparent grow placeholder:text-gray-400 text-gray-200'
                    placeholder='Write a comment' />
                  <button type='submit' className='px-5'><PaperAirplaneIcon className='w-5 h-5 text-gray-400' /></button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  )
}
