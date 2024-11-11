
let gaveta_routes = {};

import {v2 as cloudinary} from 'cloudinary';



gaveta_routes.get_gallery = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const options = {
      resource_type: "image",
      type: "upload",
      prefix: "gaveta_gallery/"
    }
    cloudinary.api.resources(options)
    .then((response) => {
      let imageURLs = []
      response.resources.forEach((resource) => {
          imageURLs.push(resource.secure_url)
        }
      )
      return res.status(200).json({ urls: imageURLs });
    })
    .catch((e) => console.log({e}));

  } catch (error) {
    return res.status(400).json({});
  }
};

export {gaveta_routes}
