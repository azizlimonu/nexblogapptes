import React, { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Messsage from '../components/Messsage';
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from 'next/link';

// ---------------------------------------------------------------//
const dashboard = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [post, setPosts] = useState([]);

  // see if user is logged
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, where('user', '==', user.uid));
    // if theres matching user.uid thats coming from the useAuth user return the doc for us
    const unsubcribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    });
    return unsubcribe;
  };

  const deletePost = async (id) => {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
    // console.log('delete have been trigered')
  }

  // getuserData
  useEffect(() => {
    getData();
  }, [user, loading])

  return (
    <div>
      <h1>
        Your Post
      </h1>

      {post?.map((post) => (
        <Messsage {...post} key={post.id} >
          <div className='flex gap-4'>
            {/* delete btn */}
            <button
              className='text-pink-600 flex items-center justify-center gap-2 py-2 text-sm'
              onClick={() => deletePost(post.id)}
            >
              <BsTrash2Fill className='text-2xl' /> Delete
            </button>

            {/* edit btn */}
            <Link href={{ pathname: '/post', query: post }}>
              <button className='text-teal-600 flex items-center justify-center gap-2 py-2 text-sm'>
                <AiFillEdit className="text-2xl" />
                Edit
              </button>
            </Link>

          </div>
        </Messsage>
      ))}

      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6"
        onClick={() => auth.signOut()}>
        Sign Out
      </button>
    </div>
  )
}

export default dashboard;