import Link from 'next/link';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Next Blog</button>
      </Link>

      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
              Join Now
            </a>
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-mg textx-sm rounded-lg">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              <img
                className="w-10 rounded-full cursor-pointer"
                src={user.photoURL}
                alt='user'
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}