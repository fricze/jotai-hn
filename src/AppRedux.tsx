import { useEffect } from 'react'
import { a, useSpring } from '@react-spring/web'
import Parser from 'html-react-parser'
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import {
    Provider,
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
    useDispatch as useReduxDispatch,
} from 'react-redux'

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

interface PostState {
    postId: number;
    post?: PostData;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: PostState = {
    postId: 9001,
    loading: 'idle',
};


const fetchPostById = createAsyncThunk(
    'posts/fetchById',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { post } = state;
        const { postId } = post;

        const response = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${postId}.json`
        )
        const data: PostData = await response.json()
        return data
    })

const postSlice = createSlice({
    name: 'hn-post',
    initialState,
    reducers: {
        setNextPage(state) {
            state.postId = state.postId + 1;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPostById.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = 'succeeded';
        })

        builder.addCase(fetchPostById.pending, (state) => {
            state.loading = 'pending';
        })
    }
})

const { actions } = postSlice

const store = configureStore({
    reducer: {
        post: postSlice.reducer,
    }
})

type RootState = ReturnType<typeof store.getState>;
const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<typeof store.dispatch>()

function Id() {
    const id = useSelector(state => state.post.postId)
    const props = useSpring({ from: { id }, id, reset: true })
    return <a.h1>{props.id.to(Math.round)}</a.h1>
}

function Next() {
    const dispatch = useDispatch()

    return (
        <button onClick={() => {
            dispatch(actions.setNextPage())

            dispatch(fetchPostById())
        }}>
            <div>→</div>
        </button>
    )
}

function PostTitle() {
    const dispatch = useDispatch()
    const post = useSelector(state => state.post.post)
    const loading = useSelector(state => state.post.loading)

    useEffect(() => {
        dispatch(fetchPostById())
    }, [])

    if (loading === 'pending') {
        return <h2>Loading...</h2>;
    }

    if (!post) {
        // won't work
        /* return <h2>Loading...</h2>; */
        return null;
    }

    const { by, text, time, title, url } = post;

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
        <Provider store={store}>
            <Id />
            <div>
                <PostTitle />
            </div>
            <Next />
        </Provider>
    )
}
