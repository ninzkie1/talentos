import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Avatar,
  CircularProgress, // Import CircularProgress for loading state
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useStateContext } from "../context/contextprovider";

export default function Customer() {
  const talents = ["Singer", "Dancer", "Musician", "Band", "Entertainer", "DJ"];
  const { user } = useStateContext();
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({
    id: null,
    clientName: user ? user.name : "",
    eventName: "",
    startTime: "",
    endTime: "",
    description: "",
    talents: [],
  });
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false); // State for loading

  // Fetch all posts from the Laravel API
  const fetchPosts = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await fetch("http://127.0.0.1:8000/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
      const initialComments = {};
      data.forEach((post) => {
        initialComments[post.id] = "";
      });
      setComments(initialComments);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("Failed to fetch posts. Please try again later."); // User feedback
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostForm({ ...postForm, [name]: value });
  };

  const handleEdit = (post) => {
    setPostForm({
      id: post.id,
      clientName: post.client_name,
      eventName: post.event_name,
      startTime: post.start_time,
      endTime: post.end_time,
      description: post.description,
      talents: Array.isArray(post.talents) ? post.talents : post.talents.split(","),
    });
    setShowFormPopup(true);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const requestData = { ...postForm };
    setLoading(true); // Set loading to true
    try {
      let response;
      if (postForm.id) {
        response = await fetch(`http://127.0.0.1:8000/api/posts/${postForm.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      } else {
        response = await fetch("http://127.0.0.1:8000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      }

      if (!response.ok) throw new Error("Failed to save post");
      fetchPosts();
      setPostForm({
        id: null,
        clientName: user ? user.name : "",
        eventName: "",
        startTime: "",
        endTime: "",
        description: "",
        talents: [],
      });
      setShowFormPopup(false);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save the post. Please try again."); // User feedback
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete post");
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post. Please try again."); // User feedback
      } finally {
        setLoading(false); // Set loading to false
      }
    }
  };

  const handleTalentChange = (talent) => {
    setPostForm((prevForm) => {
      const updatedTalents = prevForm.talents.includes(talent)
        ? prevForm.talents.filter((t) => t !== talent)
        : [...prevForm.talents, talent];
      return { ...prevForm, talents: updatedTalents };
    });
  };

  const handleCommentSubmit = async (postId) => {
    const comment = comments[postId].trim();
    if (comment) {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            content: comment,
          }),
        });

        if (!response.ok) throw new Error("Failed to submit comment");
        fetchPosts();
        setComments({ ...comments, [postId]: "" });
      } catch (error) {
        console.error("Error submitting comment:", error);
        alert("Failed to submit the comment. Please try again."); // User feedback
      } finally {
        setLoading(false); // Set loading to false
      }
    } else {
      alert("Comment cannot be empty");
    }
  };

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-4">Book a Talent for Your Event!</h1>
      </header>

      <div className="text-center mt-4">
        <button onClick={() => setShowFormPopup(true)} className="p-2 bg-blue-500 text-white rounded-md">
          Submit a Request
        </button>
      </div>

      <div className="container mx-auto">
        <Typography variant="h6" gutterBottom>
          List of Submitted Requests:
        </Typography>

        {loading ? (
          <CircularProgress /> // Show loading spinner while fetching posts
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  {post.user?.image_profile ? (
                    <Avatar src={post.user.image_profile} alt={post.client_name} sx={{ marginRight: 2 }} />
                  ) : (
                    <Avatar sx={{ bgcolor: "#2196f3", marginRight: 2 }}>
                      <AccountCircleIcon />
                    </Avatar>
                  )}
                  <Typography variant="h6" component="div">
                    {post.client_name}
                  </Typography>
                </div>

                <Typography variant="body1" color="textPrimary">
                  <strong>Event Name:</strong> {post.event_name}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  <strong>From:</strong> {post.start_time} <strong>To:</strong> {post.end_time}
                </Typography>

                <Typography variant="body1" color="textPrimary">
                  <strong>Description:</strong> {post.description}
                </Typography>

                <Typography variant="body1" color="textPrimary">
                  <strong>Categories:</strong> {Array.isArray(post.talents) ? post.talents.join(", ") : post.talents}
                </Typography>

                <div style={{ marginTop: 16 }}>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(post)} style={{ marginRight: 8 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(post.id)}>
                    Delete
                  </Button>
                </div>

                {/* Comment Section */}
                <div style={{ marginTop: 16 }}>
                  <TextField
                    fullWidth
                    label="Add Comment"
                    value={comments[post.id] || ""}
                    onChange={(e) => setComments({ ...comments, [post.id]: e.target.value })}
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" onClick={() => handleCommentSubmit(post.id)}>
                    Submit Comment
                  </Button>
                </div>

                <Typography variant="h6" style={{ marginTop: 25 }}>Comments:</Typography>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} style={{ marginLeft: 20, marginBottom: 10, border: '1px solid #ccc', borderRadius: 4, padding: 8, display: 'flex', alignItems: 'center' }}>
                      {comment.user?.avatar ? (
                        <Avatar src={comment.user.avatar} alt={comment.user.name} sx={{ marginRight: 2 }} />
                      ) : (
                        <Avatar sx={{ bgcolor: "#2196f3", marginRight: 2 }}>
                          <AccountCircleIcon />
                        </Avatar>
                      )}
                      <div>
                        <Typography variant="body2" color="textSecondary">
                          <strong>{comment.user ? comment.user.name : "Unknown User"}</strong>
                          <span style={{ marginLeft: 8, fontStyle: 'italic', fontSize: '0.9em' }}>
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          - {comment.content}
                        </Typography>
                      </div>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" style={{ marginLeft: 16 }}>
                    No comments yet.
                  </Typography>
                )}

              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">No posts available.</Typography>
        )}
      </div>

      <Modal open={showFormPopup} onClose={() => setShowFormPopup(false)}>
        <Box sx={{ width: 400, bgcolor: "background.paper", padding: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {postForm.id ? "Edit Your Request" : "Submit a Request"}
          </Typography>
          <form onSubmit={handlePostSubmit}>
            <TextField
              label="Client Name"
              name="clientName"
              value={postForm.clientName}
              onChange={handlePostChange}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Event Name"
              name="eventName"
              value={postForm.eventName}
              onChange={handlePostChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Start Time"
              name="startTime"
              value={postForm.startTime}
              onChange={handlePostChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="End Time"
              name="endTime"
              value={postForm.endTime}
              onChange={handlePostChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={postForm.description}
              onChange={handlePostChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
            />
            <Typography variant="subtitle1">Select Talents:</Typography>
            {talents.map((talent) => (
              <FormControlLabel
                key={talent}
                control={
                  <Checkbox
                    checked={postForm.talents.includes(talent)}
                    onChange={() => handleTalentChange(talent)}
                  />
                }
                label={talent}
              />
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <Button variant="outlined" onClick={() => setShowFormPopup(false)} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {postForm.id ? "Update Request" : "Submit Request"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
