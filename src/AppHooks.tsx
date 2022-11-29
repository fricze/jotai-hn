import { useEffect, useState } from 'react'
import { a, useSpring } from '@react-spring/web'
import Parser from 'html-react-parser'
import { Provider } from 'jotai'

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

function Id({ id }: { id: number }) {
    const props = useSpring({ from: { id }, id, reset: true })
    return <a.h1>{props.id.to(Math.round)}</a.h1>
}

function Next({ setNextPost }: { setNextPost: () => void }) {
    return (
        <button onClick={() => setNextPost()}>
            <div>→</div>
        </button>
    )
}

function PostTitle({ postData }: { postData: PostData; }) {
    const { by, text, time, title, url } = postData

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
    const [post, setPost] = useState<PostData>()
    const [postId, setPostId] = useState<number>(9001)
    const [loading, setLoading] = useState(false)

    const setNextPost = () => setPostId(id => id + 1)

    useEffect(() => {
        setLoading(true)

        fetchPost(postId).then(post => {
            setPost(post)
            setLoading(false)
        })
    }, [postId])

    return (
        <Provider>
            <Id id={postId} />
            <div>
                {post && !loading ? <PostTitle postData={post} /> : <h2>Loading...</h2>}
            </div>
            <Next setNextPost={setNextPost} />
        </Provider>
    )
}
