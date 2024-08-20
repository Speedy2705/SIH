import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg'
import productCategory from '../helpers/productCategory'
import {FaCloudUploadAlt} from 'react-icons/fa'
import uploadImage from '../helpers/uploadImage'
import DisplayImage from './DisplayImage'
import { MdDelete } from 'react-icons/md'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const UploadProduct = ({
    onClose,
    fetchData
}) => {
    const [data,setData] = useState({
        productName : '',
        brandName : '',
        category : '',
        productImage : [],
        description : '',
        price : '',
        sellingPrice : ''
    })

    const [openFullScreenImage,setOpenFullScreenImage] = useState(false)

    const [fullScreenImage,setFullScreenImage] = useState("")

    const handleChange = (e) => {
        const {name, value} = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })

    }

    const handleUploadProduct = async(e) => {
        
        const file = e.target.files[0]

        const uploadImageCloudinary = await uploadImage(file)

        setData((preve)=>{
            return{
                ...preve,
                productImage : [ ...preve.productImage, uploadImageCloudinary.url ]
            }
        })

    }

    const handleDeleteProductImage = async(index)=>{

        const newProductImage = [...data.productImage]
        newProductImage.splice(index,1)

        setData((preve)=>{
            return{
                ...preve,
                productImage : [ ...newProductImage ]
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const response = await fetch(SummaryApi.uploadProduct.url,{
            method : SummaryApi.uploadProduct.method,
            credentials : "include",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
        })

        const responseData = await response.json()

        if(responseData.success){
            toast.success(responseData?.message)
            onClose()
            fetchData()
        }

        if(responseData.error){
            toast.error(responseData?.message)
        }

    }
  return (
    <div className='text-white fixed w-full h-full top-0 left-0 flex justify-center items-center backdrop-blur-sm'>
        <div className='bg-black p-4 rounded-3xl w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

            <div className='flex justify-between items-center pb-3'>
                <h2 className='font-bold text-lg'>Upload Product</h2>
                <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                    <CgClose/>
                </div>
            </div>


            <form className='grid p-4 gap-2 overflow-y-scroll h-full scrollbar-none' onSubmit={handleSubmit}>
                <label htmlFor='productName'>Product Name :</label>
                <input 
                    type='text' 
                    id='productName' 
                    placeholder='enter product name'
                    name='productName'
                    value={data.productName} 
                    onChange={handleChange}
                    className='py-2 px-3 bg-slate-900 border rounded-xl'
                    required
                />

                <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
                <input
                    required 
                    type='text' 
                    id='brandName' 
                    placeholder='enter brand name'
                    name='brandName'
                    value={data.brandName} 
                    onChange={handleChange}
                    className='py-2 px-3 bg-slate-900 border rounded-xl'
                />

                <label htmlFor='category' className='mt-3'>Category :</label>
                <select required value={data.category} name='category' onChange={handleChange} className='py-2 px-3 bg-slate-900 border rounded-xl text-slate-400'>
                    <option value={""}>select Category</option>
                    {
                        productCategory.map((el,index)=>{
                            return (
                                <option value={el.value} key={el.value+index}>{el.label}</option>
                            )
                        })
                    }
                </select>

                <label htmlFor='productImage' className='mt-3'>Product Image :</label>
                <label htmlFor='uploadImageInput'>
                    <div className='flex justify-center items-center p-2 bg-slate-900 border rounded-xl h-48 w-full cursor-pointer'>
                        <div className='text-slate-400 flex flex-col justify-center items-center gap-2'>
                            <span className='text-4xl'><FaCloudUploadAlt/></span>
                            <p className='text-sm'>Upload Product Image</p>
                            <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct}/>
                        </div>
                    </div>
                </label>
                <div>
                    {
                        data?.productImage[0] ? (
                            <div className='flex items-center gap-2 p-2'>
                                {
                                    data.productImage.map((el,index)=>{
                                        return (
                                            <div className='relative group'>
                                                <img
                                                    src={el} 
                                                    alt={el} 
                                                    width={80} 
                                                    height={80} 
                                                    className='bg-slate-900 border cursor-pointer' 
                                                    onClick={()=>{
                                                        setOpenFullScreenImage(true)
                                                        setFullScreenImage(el)
                                                    }}
                                                />

                                                <div className='absolute bottom-0 right-0 p-1 hover:text-white hover:bg-red-600 rounded-full text-sm text-red-700 cursor-pointer hidden group-hover:block' onClick={()=>handleDeleteProductImage(index)}>
                                                    <MdDelete/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload product image</p>
                        )
                    }
                </div>

                <label htmlFor='price' className='mt-3'>Price :</label>
                <input 
                    required
                    type='number' 
                    id='price' 
                    placeholder='enter price'
                    name='price'
                    value={data.price} 
                    onChange={handleChange}
                    className='py-2 px-3 bg-slate-900 border rounded-xl'
                />

                <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
                <input
                    required 
                    type='number' 
                    id='sellingPrice' 
                    placeholder='enter selling price'
                    name='sellingPrice'
                    value={data.sellingPrice} 
                    onChange={handleChange}
                    className='py-2 bg-slate-900 border rounded-xl px-3'
                />

                <label htmlFor='description' className='mt-3'>Description :</label>
                <textarea 
                    className='h-28 bg-slate-900 border resize-none px-3 py-2 rounded-xl' 
                    placeholder='enter product description' 
                    rows={3} cols={5} 
                    value={data.description}
                    name='description'
                    onChange={handleChange}
                >

                </textarea>

                <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload Product</button>
            </form>
            
        </div>

        {
            openFullScreenImage && (
                <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
            )
        }

    </div>
  )
}

export default UploadProduct