import { Suspense } from 'react'
import { a, useSpring } from '@react-spring/web'
import Parser from 'html-react-parser'
import { Provider, atom, useAtom } from 'jotai'
import { selectAtom, useUpdateAtom } from 'jotai/utils'

type PostData = {
    by: string;
    descendants?: number;
    id: number;
    kids?: number[];
    parent: number;
    score?: number;
    text?: string;
    time: number;
    title?: string;
    type: 'comment' | 'story';
    url?: string;
}

const fetchPost = async (id: number) => (await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
)).json();

const postId = atom(9001)

const postData = selectAtom(postId, (postId): Promise<PostData> => fetchPost(postId))

// const postData = atom(async (get): Promise<PostData> => fetchPost(get(postId)))

/* const postData = atom(async (get): Promise<PostData> => {
*     const id = get(postId)
*
*     return fetchPost(id)
* })
*  */

/* const postData = atom(async (get) => {
*     const id = get(postId)
*     const response = await fetch(
*         `https://hacker-news.firebaseio.com/v0/item/${id}.json`
*     )
*     const data: PostData = await response.json()
*     return data;
*
*     return response.json()
* })
*  */
function Id() {
    const [id] = useAtom(postId)
    const props = useSpring({ from: { id }, id, reset: true })
    return <a.h1>{props.id.to(Math.round)}</a.h1>
}

function Next() {
    // Use `useUpdateAtom` to avoid re-render
    // const [, set] = useAtom(postId)
    const setPostId = useUpdateAtom(postId)
    return (
        <button onClick={() => setPostId((id) => id + 1)}>
            <div>→</div>
        </button>
    )
}

function PostTitle() {
    const [{ by, text, time, title, url }] = useAtom(postData)
    return (
        <>
            <h2>{by}</h2>
            <h6>{new Date(time * 1000).toLocaleDateString('en-US')}</h6>
            {title && <h4>{title}</h4>}
            {url && <a href={url}>{url}</a>}
            {text && <div>{Parser(text)}</div>}
        </>
    )
}

export default function App() {
    return (
        <Provider>
            <Id />
            <div>
                <Suspense fallback={<h2>Loading...</h2>}>
                    <PostTitle />
                </Suspense>
            </div>
            <Next />
        </Provider>
    )
}
