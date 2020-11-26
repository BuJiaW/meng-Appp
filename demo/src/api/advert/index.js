import request from "../../utils/request"

//获取数据列表
export function getAdvList(query,current,size){
    return request({
        url:"/article/advert/search",
        method:"POST",
        data:{
            ...query,
            current,
            size,
        }
    })
}

//删除
export function deleteAdv(id){
    return request({
        url:`article/advert/${id}`,
        method:"DELETE"
    })
}

//编辑

//获取编辑的id接口
export function editAdv(id){
    return request({
        url:`article/advert/${id}`,
        method:"GET"
    })
}

//获取修改的确认接口
export function update(){
    return request({
        url:"article/advert",
        method:"PUT"
    })
}

//添加图片接口
export function addImage(data){
    return request({
        url:`/article/file/upload`,
        method:"POST",
        data
    })
}
//删除图片接口
export function deleteImage(imageUrl){
    return request({
        url: `/article/file/delete`,
        method: 'delete',
        params: {'fileUrl': imageUrl}
    })
}

export function add(){
    return request({
        url:"/article/advert",
        method:"POST"
    })
}