import mongoose, { PaginateModel, Schema, Document } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface IShortlink extends Document {
    original: string
    parsed?: string
    createdAt: Date
    updatedAt: Date
}

export const ShortlinkSchema: Schema = new Schema({
    original: {
        type: String,
        required: true,
        unique: true,
    },
    parsed: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
})

ShortlinkSchema.plugin(mongoosePaginate)

interface IShortlinkModel<T extends Document> extends PaginateModel<T> { }

const Shortlink: IShortlinkModel<IShortlink> = mongoose.model<IShortlink>('Shortlink', ShortlinkSchema) as IShortlinkModel<IShortlink>

export default Shortlink
