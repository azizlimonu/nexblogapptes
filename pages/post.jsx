import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";

import React from 'react'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const post = () => {
  // form state
  const [post, setPost] = useState({ description: '' });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  // submit post
  const submitPost = async (e) => {
    e.preventDefault();
    // check if the user allowed to submit or not
    // if theres no description
    if (!post.description) {
      toast.error('Description Cannot Be Empty', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
      // return stop the submitPost running execution
    }

    if (post?.description.length > 300) {
      toast.error('Description maximum 300 character', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      setPost({ description: '' });
      return;
    }
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      //Make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: '' });
      toast.success('Post has been uploaded')
      // after submit go to the homepage
      return route.push('/')
    };

  };

  // check user have the id where it comes from edit btn
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push('/auth/login');
    // we check if we have click edit btn and we have some id in doc we show the doc instead of blank post again
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading])

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        {/* if the post have property 'ID' we gonna edit post else we make create post  */}
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty('id') ? 'Edit your post' : 'Create Post'}
        </h1>

        <div className="py-2">
          <h3 className="text-lg font-medium py-2">
            Description
          </h3>
          <textarea
            value={post.description}
            // e.target.value didnt work bcuz its gonna delete the desc obj
            // onChange={(e) => setPost(e.target.value)}
            // so we use this
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          />
          <p
            className={`text-cyan-600 font-medium text-sm ${post.description.length > 300 ? "text-red-600" : ""}`}
          >
            {post.description.length}/300
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>

    </div>
  )
}

export default post;