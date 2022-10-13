import Messsage from "../components/Messsage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from '../utils/firebase.js'
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState('');
  const [allMessage, setAllMessages] = useState([]);

  // submit message function
  const submitMessage = async () => {
    // subtmit but if theres a user login
    if (!auth.currentUser) {
      console.log(auth)
      return router.push('/auth/login')
    }

    // logic if theres no message
    if (!message) {
      toast.error('Please dont empty the message', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if(message.length > 100){
      toast.error('Just 100 character please', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, 'posts', routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage('');
  };

  // Get Comment
  const getComments = async () => {
    const docRef = doc(db, 'posts', routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments)
    });
    return unsubscribe;
  }

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      {/* routeData we get our query */}
      <Messsage {...routeData}></Messsage>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type='text'
            value={message}
            placeholder='send a message'
            className="bg-gray-800 w-full p-2 text-white text-sm"
          />
          <button
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
            onClick={submitMessage}
          >
            Submit
          </button>
        </div>

        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessage?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.time}>
              <div className="flex items-center gap-2 mb-4">
                <img
                  className="w-10 rounded full"
                  src={message.avatar}
                  alt={message.userName}
                />
                <h2>{message.userName}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}