import cloudinary from "../../utils/cloudinary/index.js";
import { asyncHandler } from "../../utils/index.js";
import { postModel } from "../../DB/models/post.model.js";

export const createPost = asyncHandler(async (request, response, next) => {
  const { content } = request.body;
  if (request?.files?.length) {
    const images = [];
    for (const file of request.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "social-app/posts",
        }
      );
      images.push({ secure_url, public_id });
    }
    request.body.attachments = images;
  }

  const post = await postModel.create({
    content,
    userId: request.user._id,
    attachments: request.body.attachments,
  });

  return response.status(201).json({ message: "done", post });
});

export const updatePost = asyncHandler(async (request, response, next) => {
  const { postId } = request.params;

  const post = await postModel.findOne({
    _id: postId,
    userId: request.user._id,
    isDeleted: { $exists: false },
  });
  if (!post) {
    return next(
      new Error("Post not found or unauthorized user", { cause: 400 })
    );
  }
  if (request?.files?.length) {
    //delete old images belong to this post
    for (const file of post.attachments) {
       await cloudinary.uploader.destroy(file.public_id)
    }
    const images = [];
    for (const file of request.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "social-app/posts",
        }
      );
      images.push({ secure_url, public_id });
    }
    post.attachments = images;
  }
  if(request.body.content){
    post.content=request.body.content
  }

  await post.save()
  return response.status(200).json({ message: "Post updated", post });
});
