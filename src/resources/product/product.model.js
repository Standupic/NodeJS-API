import mongoose from 'mongoose'
import cuid from 'cuid'

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, default: cuid },
    description: String,
    imgThumb: String,
    img: String,
    link: String,
    userId: String,
    userName: String,
    userLink: String,
    tags: { type: [String], index: true },
    createdBy: {
      type: String,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

export const Product = mongoose.model('product', productSchema)
