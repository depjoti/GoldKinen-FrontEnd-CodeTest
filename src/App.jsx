import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { DiJavascript } from 'react-icons/di';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes, commentsRes] = await Promise.all([
          axios.get('https://jsonplaceholder.typicode.com/posts'),
          axios.get('https://jsonplaceholder.typicode.com/users'),
          axios.get('https://jsonplaceholder.typicode.com/comments'),
        ]);

        setPosts(postsRes.data);
        setUsers(usersRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserById = (userId) => users.find((user) => user.id === userId);
  const getCommentsByPostId = (postId) => comments.filter((comment) => comment.postId === postId);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: "#808080" }}>
      <VerticalTimeline>
        {posts
          .sort((a, b) => b.id - a.id)
          .map((post) => {
            const user = getUserById(post.userId);
            const postComments = getCommentsByPostId(post.id);

            return (
              <VerticalTimelineElement
                key={post.id}
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                date={`Post ID: ${post.id}`}
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<DiJavascript />}
              >
                <h3 className="vertical-timeline-element-title">{post.title}</h3>
                <h4 className="vertical-timeline-element-subtitle">{user ? user.name : 'Unknown User'}</h4>
                <p>{post.body}</p>
                <details>
                  <summary>Comments ({postComments.length})</summary>
                  {postComments.map((comment) => (
                    <div key={comment.id} style={{ marginTop: '10px' }}>
                      <strong>{comment.name}</strong> ({comment.email}):
                      <p>{comment.body}</p>
                    </div>
                  ))}
                </details>
              </VerticalTimelineElement>
            );
          })}
      </VerticalTimeline>
    </div>
  );
};

export default App;


