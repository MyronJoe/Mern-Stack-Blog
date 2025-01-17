import { Carousel } from "flowbite-react";
import { useEffect, useState } from 'react';

export function CarouselPage() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts?limit=4');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="h-[25rem] sm:h-[30rem] xl:h-[30rem] 2xl:h-[30rem] rounded-none overflow-hidden">
      <Carousel>

        {posts.map((post) => (
          <img className="h-[25rem] sm:h-[30rem] xl:h-[30rem] 2xl:h-[30rem] object-cover rounded-none" key={post._id} src={post.image} alt={post.image} />
        ))}

      </Carousel>
    </div>
  );
}